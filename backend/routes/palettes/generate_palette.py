from fastapi import UploadFile
from PIL import Image

from algorithms.kmeans import get_image_colors
from algorithms.utils import convert_to_rgb, scale_image
from config import get_config
from consts import ErrorMsg
from middleware.auth import RequestWithAuthState
from routes.palettes.palette_response_models import (
    map_generate_palette_array_to_response,
)
from routes.shared import AuthedRequest, BaseErrorResponse, BaseSuccessResponse, InvalidRequest
from services.logger import log_error
from utils.auth import get_user_auth

from .palette_response_models import GeneratePaletteResponse
from .palettes_router import palettes_router

config = get_config()

ROUTE_NAME = "generate_palette"


def parse_request(
    raw_request: RequestWithAuthState, parsed_thumbnail: UploadFile
) -> tuple[AuthedRequest, UploadFile] | InvalidRequest:
    authed_user = get_user_auth(raw_request)

    if not authed_user:
        return InvalidRequest(error=ErrorMsg.CANNOT_PERFORM_ACTION)

    if not parsed_thumbnail:
        return InvalidRequest(error=ErrorMsg.RESOURCE_NOT_FOUND)

    return (
        AuthedRequest(app_user_id=authed_user.app_user_id, auth_id=authed_user.auth_id),
        parsed_thumbnail,
    )


class SuccessResponse(BaseSuccessResponse):
    palette: list[GeneratePaletteResponse]
    # paletteId: uuid.UUID  #815


@palettes_router.post("/generate")
async def generate(
    raw_request: RequestWithAuthState,
    thumbnail: UploadFile,  # Filesize is enforced in middleware
):
    try:
        result = parse_request(raw_request, thumbnail)

        match result:
            case InvalidRequest(error=error):
                log_error(RuntimeError(error), ROUTE_NAME)
                return BaseErrorResponse(message=error)

            case (AuthedRequest(app_user_id=_app_user_id, auth_id=_auth_id), parsed_thumbnail):
                # Read the file content once and create BytesIO
                image = Image.open(parsed_thumbnail.file)
                scaled_image = scale_image(image, 200)
                rgb_image = convert_to_rgb(scaled_image)
                colors = get_image_colors(rgb_image)

                # id = uuid.uuid4()

                # buffer = BytesIO()
                # image.save(buffer, format="JPEG")
                # img_bytes = buffer.getvalue()
                # photo_details = save_photo(img_bytes, str(id), "jpeg")

                # hex_colors = [color["color"] for color in colors]
                # og_image = generate_og_image(image, hex_colors)

                # blurhash = encode_blurhash(thumbnail)

                # og_photo_details = save_photo(og_image.getvalue(), f"{id!s}_og", "webp")

                # palette = Palette(
                #     id=id,
                #     name="",
                #     app_user_id=app_user_id,
                #     photo_details=photo_details,
                #     og_photo_details=og_photo_details,
                #     blurhash=blurhash,
                #     aspect_ratio=image.width / image.height,
                # )

                # create_palette(palette)

                return SuccessResponse(palette=map_generate_palette_array_to_response(colors))
    except Exception as error:
        log_error(error, ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.SOMETHING_WENT_WRONG)
