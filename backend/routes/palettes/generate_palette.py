import uuid
from io import BytesIO

from fastapi import UploadFile
from PIL import Image

from algorithms.kmeans import get_image_colors
from algorithms.og import generate_og_image
from algorithms.utils import convert_to_rgb, scale_image
from config import get_config
from consts import ERROR_MSG
from database.models import Palette
from database.queries.palettes import create_palette
from middleware.auth import RequestWithAuthState
from routes.palettes.palette_response_models import (
    map_generate_palette_array_to_response,
)
from routes.shared import AuthedRequest, BaseErrorResponse, BaseSuccessResponse, InvalidRequest
from services.logger import log_error
from utils.auth import user_is_authed
from utils.blurhash import encode_blurhash
from utils.photos import save_photo

from . import palettes_router
from .palette_response_models import GeneratePaletteResponse

config = get_config()

ROUTE_NAME = "generate_palette"


def parse_request(
    raw_request: RequestWithAuthState, photo: UploadFile
) -> tuple[AuthedRequest, UploadFile] | InvalidRequest:
    if not user_is_authed(raw_request):
        return InvalidRequest(error=ERROR_MSG.CANNOT_PERFORM_ACTION)

    if not photo:
        return InvalidRequest(error=ERROR_MSG.RESOURCE_NOT_FOUND)

    return (
        AuthedRequest(app_user_id=raw_request.state.app_user_id, auth_id=raw_request.state.auth_id),
        photo,
    )


class SuccessResponse(BaseSuccessResponse):
    palette: list[GeneratePaletteResponse]
    paletteId: uuid.UUID  # noqa #815


@palettes_router.post("/generate")
async def generate(raw_request: RequestWithAuthState, photo: UploadFile):
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
        return BaseErrorResponse(message=ERROR_MSG.SOMETHING_WENT_WRONG)
