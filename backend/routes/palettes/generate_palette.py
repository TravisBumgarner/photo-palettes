from fastapi import UploadFile
from PIL import Image
from pydantic import BaseModel

from algorithms.ciede2000 import ciede2000
from algorithms.kmeans import kmeans
from algorithms.types import TGeneratedPalette
from algorithms.utils import convert_to_rgb, scale_image
from config import get_config
from consts import ErrorMsg
from database.models import PermissionLevel
from middleware.auth import RequestWithAuthState
from routes.shared import (
    BaseErrorResponse,
    BaseSuccessResponse,
)
from services.logger import log_error

from .palettes_router import palettes_router

config = get_config()

ROUTE_NAME = "generate_palette"


class GeneratePaletteResponse(BaseModel):
    color: str
    percentLocation: tuple[float, float]  # noqa #815


def map_generate_palette_to_response(
    color: str,
    percent_location: tuple[float, float],
) -> GeneratePaletteResponse:
    return GeneratePaletteResponse(
        color=color,
        percentLocation=(percent_location[0], percent_location[1]),
    )


def map_generate_palette_data_to_response(
    generated_palette: TGeneratedPalette,
) -> list[GeneratePaletteResponse]:
    return [
        map_generate_palette_to_response(item.color, item.percent_location)
        for item in generated_palette
    ]


class SuccessResponse(BaseSuccessResponse):
    palettes: list[list[GeneratePaletteResponse]]


def handle_request(thumbnail: UploadFile):
    image = Image.open(thumbnail.file)
    scaled_image = scale_image(image, 100)
    rgb_image = convert_to_rgb(scaled_image)

    palettes = [
        kmeans(rgb_image),
        ciede2000(rgb_image, "light"),
        ciede2000(rgb_image, "dark"),
    ]

    return SuccessResponse(
        palettes=[
            map_generate_palette_data_to_response(palette)
            for palette in palettes
            if len(palette) == 6
        ],
    )


@palettes_router.post("/generate")
async def generate(
    request: RequestWithAuthState,
    thumbnail: UploadFile,  # Filesize is enforced in middleware
):
    if request.state.permission_level < PermissionLevel.MEMBER:
        log_error(RuntimeError(ErrorMsg.CANNOT_PERFORM_ACTION), ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.CANNOT_PERFORM_ACTION)

    if not thumbnail:
        return BaseErrorResponse(message=ErrorMsg.RESOURCE_NOT_FOUND)

    try:
        return handle_request(thumbnail)

    except Exception as error:
        log_error(error, ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.SOMETHING_WENT_WRONG)
