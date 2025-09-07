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
    import time

    image = Image.open(thumbnail.file)
    scaled_image = scale_image(image, 100)
    rgb_image = convert_to_rgb(scaled_image)

    start_kmeans = time.time()
    palette_kmeans = kmeans(rgb_image)
    end_kmeans = time.time()
    print(f"ruda: kmeans took {end_kmeans - start_kmeans:.3f} seconds")

    start_light = time.time()
    palette_ciede2000_light = ciede2000(rgb_image, "light")
    end_light = time.time()
    print(f"ruda: ciede2000_light took {end_light - start_light:.3f} seconds")

    start_dark = time.time()
    palette_ciede2000_dark = ciede2000(rgb_image, "dark")
    end_dark = time.time()
    print(f"ruda: ciede2000_dark took {end_dark - start_dark:.3f} seconds")

    print(f"ruda: total time {end_dark - start_kmeans:.3f} seconds")
    return SuccessResponse(
        palettes=[
            map_generate_palette_data_to_response(palette_kmeans),
            map_generate_palette_data_to_response(palette_ciede2000_light),
            map_generate_palette_data_to_response(palette_ciede2000_dark),
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
