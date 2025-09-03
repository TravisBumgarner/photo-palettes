from fastapi import UploadFile
from PIL import Image

from algorithms.kmeans import get_image_colors
from algorithms.utils import convert_to_rgb, scale_image
from config import get_config
from consts import ErrorMsg
from database.models import PermissionLevel
from middleware.auth import RequestWithAuthState
from routes.palettes.palette_response_models import (
    map_generate_palette_array_to_response,
)
from routes.shared import (
    BaseErrorResponse,
    BaseSuccessResponse,
    InvalidRequest,
)
from services.logger import log_error

from .palette_response_models import GeneratePaletteResponse
from .palettes_router import palettes_router

config = get_config()

ROUTE_NAME = "generate_palette"


class SuccessResponse(BaseSuccessResponse):
    palette: list[GeneratePaletteResponse]


def handle_request(thumbnail: UploadFile):
    image = Image.open(thumbnail.file)
    scaled_image = scale_image(image, 200)
    rgb_image = convert_to_rgb(scaled_image)
    colors = get_image_colors(rgb_image)

    return SuccessResponse(palette=map_generate_palette_array_to_response(colors))


@palettes_router.post("/generate")
async def generate(
    request: RequestWithAuthState,
    thumbnail: UploadFile,  # Filesize is enforced in middleware
):
    if request.state.permission_level < PermissionLevel.MEMBER:
        log_error(RuntimeError(ErrorMsg.CANNOT_PERFORM_ACTION), ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.CANNOT_PERFORM_ACTION)

    if not thumbnail:
        return InvalidRequest(error=ErrorMsg.RESOURCE_NOT_FOUND)

    try:
        return handle_request(thumbnail)

    except Exception as error:
        log_error(error, ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.SOMETHING_WENT_WRONG)
