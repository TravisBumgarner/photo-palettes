import uuid
from io import BytesIO

from fastapi import UploadFile
from PIL import Image

from algorithms.kmeans import get_image_colors
from algorithms.og import generate_og_image
from algorithms.utils import convert_to_rgb, scale_image
from config import get_config
from consts import ErrorMsg
from database.models import Palette
from database.queries.palettes import create_palette
from middleware.auth import RequestWithAuthState
from routes.palettes.palette_response_models import (
    map_generate_palette_array_to_response,
)
from routes.shared import AuthedRequest, BaseErrorResponse, BaseSuccessResponse, InvalidRequest
from services.logger import log_error
from utils.auth import get_user_auth
from utils.blurhash import encode_blurhash
from utils.photos import save_photo

from .palette_response_models import GeneratePaletteResponse
from .palettes_router import palettes_router

config = get_config()

ROUTE_NAME = "generate_palette"


def parse_request(
    raw_request: RequestWithAuthState, photo: UploadFile
) -> tuple[AuthedRequest, UploadFile] | InvalidRequest:
    user_auth = get_user_auth(raw_request)
    if not user_auth:
        return InvalidRequest(error=ErrorMsg.CANNOT_PERFORM_ACTION)

    if not photo:
        return InvalidRequest(error=ErrorMsg.RESOURCE_NOT_FOUND)

    return (
        AuthedRequest(auth_id=user_auth.auth_id, app_user_id=user_auth.app_user_id),
        photo,
    )


class SuccessResponse(BaseSuccessResponse):
    palette: list[GeneratePaletteResponse]
    paletteId: uuid.UUID  # noqa #815


@palettes_router.post("/generate")
async def generate(
    raw_request: RequestWithAuthState,
    photo: UploadFile,  # Filesize is enforced in middleware
):
    try:
        [parsed_content, parsed_photo] = parse_request(raw_request, photo)

        match parsed_content:
            case InvalidRequest(error=error):
                log_error(RuntimeError(error), ROUTE_NAME)
                return BaseErrorResponse(error=error)

            case AuthedRequest(app_user_id=app_user_id, auth_id=_auth_id):
                # Read the file content once and create BytesIO
                image = Image.open(parsed_photo.file)
                thumbnail = scale_image(image, 200)
                thumbnail = convert_to_rgb(thumbnail)
                colors = get_image_colors(thumbnail)

                id = uuid.uuid4()

                buffer = BytesIO()
                image.save(buffer, format="JPEG")
                img_bytes = buffer.getvalue()
                photo_details = save_photo(img_bytes, str(id), "jpeg")

                hex_colors = [color["color"] for color in colors]
                og_image = generate_og_image(image, hex_colors)

                blurhash = encode_blurhash(thumbnail)

                og_photo_details = save_photo(og_image.getvalue(), f"{id!s}_og", "webp")

                palette = Palette(
                    id=id,
                    name="",
                    app_user_id=app_user_id,
                    photo_details=photo_details,
                    og_photo_details=og_photo_details,
                    blurhash=blurhash,
                    aspect_ratio=image.width / image.height,
                )

                create_palette(palette)

                return SuccessResponse(
                    palette=map_generate_palette_array_to_response(colors), paletteId=palette.id
                )
    except Exception as error:
        log_error(error, ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.SOMETHING_WENT_WRONG)
