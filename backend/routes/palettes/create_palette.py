import json
import uuid
from io import BytesIO

from fastapi import Form, UploadFile
from PIL import Image
from pydantic import BaseModel, validator

from algorithms.kmeans import get_image_colors
from algorithms.og import generate_og_image
from algorithms.utils import convert_to_rgb, scale_image
from consts import ErrorMsg
from database.models import Palette, PaletteColor
from database.queries.palettes import create_palette
from middleware.auth import RequestWithAuthState
from routes.shared import AuthedRequest, BaseErrorResponse, BaseSuccessResponse, InvalidRequest
from services.logger import log_error
from services.pushover import send_pushover_notification
from utils.auth import get_user_auth
from utils.blurhash import encode_blurhash
from utils.colors import hex_to_rgb
from utils.photos import save_photo

from .palettes_router import palettes_router

ROUTE_NAME = "create_palette"

TUPLE_SIZE = 2
HEX_LENGTH = 7


class PaletteItem(BaseModel):
    color: str
    percent_location: list[float]

    @validator("color")
    def color_must_be_valid_hex(cls, v):  # noqa N805
        if not isinstance(v, str):
            raise ValueError("color must be a string")
        if not v.startswith("#") or len(v) != HEX_LENGTH:
            raise ValueError("color must be a valid hex color string")
        return v

    @validator("percent_location")
    def percent_location_must_be_two_floats(cls, v):  # noqa N805
        if not isinstance(v, list) or len(v) != TUPLE_SIZE:
            raise ValueError(f"percent_location must be a list of {TUPLE_SIZE} floats")
        if not all(isinstance(x, float | int) for x in v):
            raise ValueError("percent_location must contain only numbers")
        return [float(x) for x in v]


def parse_request(
    raw_request: RequestWithAuthState, palette: str, image: UploadFile
) -> tuple[AuthedRequest, list[PaletteItem], UploadFile] | tuple[InvalidRequest, None, None]:
    user_auth = get_user_auth(raw_request)

    if not user_auth:
        return (InvalidRequest(error=ErrorMsg.CANNOT_PERFORM_ACTION), None, None)

    if not image:
        return (InvalidRequest(error=ErrorMsg.RESOURCE_NOT_FOUND), None, None)

    json_palette = json.loads(palette)
    try:
        parsed_palette = [PaletteItem(**item) for item in json_palette]
    except Exception as e:
        return (InvalidRequest(error=str(e)), None, None)

    return (
        AuthedRequest(auth_id=user_auth.auth_id, app_user_id=user_auth.app_user_id),
        parsed_palette,
        image,
    )


class SuccessResponse(BaseSuccessResponse):
    paletteId: uuid.UUID  # noqa #815


class PaletteModel(BaseModel):
    palette: list[PaletteItem]


@palettes_router.post("/create")
async def create(
    raw_request: RequestWithAuthState,
    image: UploadFile,
    name: str = Form(...),
    palette: str = Form(...),
):
    try:
        [parsed_request, parsed_palette, parsed_image] = parse_request(raw_request, palette, image)

        match parsed_request:
            case InvalidRequest(error=error):
                log_error(RuntimeError(error), ROUTE_NAME)
                return BaseErrorResponse(message=error)

            case AuthedRequest(app_user_id=app_user_id):
                palette_id = uuid.uuid4()

                pil_image = Image.open(parsed_image.file)
                thumbnail = scale_image(pil_image, 200)
                thumbnail = convert_to_rgb(thumbnail)
                colors = get_image_colors(thumbnail)

                buffer = BytesIO()
                pil_image.save(buffer, format="JPEG")
                img_bytes = buffer.getvalue()
                photo_details = save_photo(img_bytes, str(palette_id), "jpeg")

                hex_colors = [item.color for item in parsed_palette]
                og_image = generate_og_image(pil_image, hex_colors)

                blurhash = encode_blurhash(thumbnail)

                og_photo_details = save_photo(og_image.getvalue(), f"{palette_id!s}_og", "webp")

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
                            percent_location=swatch.percent_location,
                        )
                    )

                palette = Palette(
                    id=palette_id,
                    name=name,
                    app_user_id=app_user_id,
                    photo_details=photo_details,
                    og_photo_details=og_photo_details,
                    blurhash=blurhash,
                    aspect_ratio=pil_image.width / pil_image.height,
                    colors=colors,
                )

                create_palette(palette)

                send_pushover_notification(f"New palette submitted: {name}")
                return SuccessResponse(
                    paletteId=palette.id,
                )

    except Exception as e:
        log_error(e, ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.SOMETHING_WENT_WRONG)
