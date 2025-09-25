import json
import uuid
from io import BytesIO

from common.models import ImageWorkerActionEnum, Palette, PaletteColor, PermissionLevel
from common.queries.worker import insert_image_worker
from common.utils.photos import save_photo
from fastapi import Form, UploadFile
from PIL import Image
from pydantic import BaseModel, field_validator

from algorithms.utils import scale_image
from config import get_config
from consts import ErrorMsg
from database.engine import db_engine
from database.queries.palettes import create_palette
from middleware.auth import RequestWithAuthState
from routes.shared import (
    BaseErrorResponse,
    BaseSuccessResponse,
)
from services.logger import log_error
from services.pushover import send_pushover_notification
from utils.blurhash import encode_blurhash
from utils.colors import hex_to_rgb

from .palettes_router import palettes_router

ROUTE_NAME = "create_palette"

TUPLE_SIZE = 2
HEX_LENGTH = 7

config = get_config()


class PaletteItem(BaseModel):
    color: str
    percent_location: list[float]

    @field_validator("color")
    def color_must_be_valid_hex(cls, v):  # noqa N805
        if not isinstance(v, str):
            raise ValueError("color must be a string")
        if not v.startswith("#") or len(v) != HEX_LENGTH:
            raise ValueError("color must be a valid hex color string")
        return v

    @field_validator("percent_location")
    def percent_location_must_be_two_floats(cls, v):  # noqa N805
        if not isinstance(v, list) or len(v) != TUPLE_SIZE:
            raise ValueError(f"percent_location must be a list of {TUPLE_SIZE} floats")
        if not all(isinstance(x, float | int) for x in v):
            raise ValueError("percent_location must contain only numbers")
        return [float(x) for x in v]


class SuccessResponse(BaseSuccessResponse):
    paletteId: uuid.UUID  # noqa #815


def handle_request(
    image: UploadFile,
    name: str,
    parsed_palette: list[PaletteItem],
    request: RequestWithAuthState,
):
    palette_id = uuid.uuid4()

    pil_image = Image.open(image.file)
    thumbnail = scale_image(pil_image, 200)

    buffer = BytesIO()
    pil_image.save(buffer, format="JPEG")
    img_bytes = buffer.getvalue()
    photo_details = save_photo(
        is_production=config.is_production,
        debug_cloudinary_locally=config.debug_cloudinary_locally,
        photo=img_bytes,
        basename=str(palette_id),
        extension="jpeg",
    )

    blurhash = encode_blurhash(thumbnail)

    colors = []
    for swatch in parsed_palette:
        r, g, b = hex_to_rgb(swatch.color)
        colors.append(
            PaletteColor(
                hex=swatch.color,
                r=r,
                g=g,
                b=b,
                rgb_cube=f"({r},{g},{b})",
                palette_id=palette_id,
                percent_location=[round(x, 2) for x in swatch.percent_location],
            )
        )

    new_palette = Palette(
        id=palette_id,
        name=name,
        app_user_id=request.state.app_user_id,
        photo_details=photo_details,
        og_photo_details="",
        blurhash=blurhash,
        aspect_ratio=pil_image.width / pil_image.height,
        colors=colors,
    )

    create_palette(new_palette)

    insert_image_worker(
        db_engine=db_engine,
        palette_id=palette_id,
        action_type=ImageWorkerActionEnum.GENERATE_OG,
        json_data=None,
    )

    send_pushover_notification(f"New palette submitted: {name}")
    return SuccessResponse(
        paletteId=new_palette.id,
    )


@palettes_router.post("/create")
async def create(
    request: RequestWithAuthState,
    image: UploadFile,
    name: str = Form(...),
    palette: str = Form(...),
):
    if request.state.permission_level < PermissionLevel.MEMBER:
        return BaseErrorResponse(message=ErrorMsg.CANNOT_PERFORM_ACTION)

    if not image:
        return BaseErrorResponse(message=ErrorMsg.RESOURCE_NOT_FOUND)

    json_palette = json.loads(palette)
    try:
        parsed_palette = [PaletteItem(**item) for item in json_palette]
    except Exception as e:
        return BaseErrorResponse(message=str(e))

    try:
        return handle_request(image, name, parsed_palette, request)

    except Exception as e:
        log_error(e, ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.SOMETHING_WENT_WRONG)
