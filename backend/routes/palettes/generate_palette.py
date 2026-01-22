import signal

from common.models import PermissionLevel
from fastapi import UploadFile
from PIL import Image
from pydantic import BaseModel

from algorithms.ciede2000 import ciede2000
from algorithms.color_wheel_spread import color_wheel_spread
from algorithms.edge_colors import edge_colors
from algorithms.histogram_peaks import histogram_peaks
from algorithms.kmeans import kmeans
from algorithms.median_cut import median_cut
from algorithms.spatial_corners import spatial_corners
from algorithms.temperature_split import temperature_split
from algorithms.types import TGeneratedPalette, TSwatch
from algorithms.utils import convert_to_rgb, scale_image
from algorithms.vibrance_peak import vibrance_peak
from config import get_config
from consts import ErrorMsg
from middleware.auth import RequestWithAuthState
from routes.shared import (
    BaseErrorResponse,
    BaseSuccessResponse,
)
from services.logger import log_error
from utils.sort_colors import get_color_sort_key

from .palettes_router import palettes_router


class TimeoutError(Exception):
    pass


def timeout_handler(signum, frame):
    raise TimeoutError("Algorithm timed out")


def run_with_timeout(func, args, timeout_seconds=5):
    """Run a function with a timeout. Returns None if it times out."""
    old_handler = signal.signal(signal.SIGALRM, timeout_handler)
    signal.alarm(timeout_seconds)
    try:
        result = func(*args)
        signal.alarm(0)
        return result
    except TimeoutError:
        return None
    finally:
        signal.signal(signal.SIGALRM, old_handler)


config = get_config()

ROUTE_NAME = "generate_palette"


class GeneratePaletteSwatchResponse(BaseModel):
    color: str
    percentLocation: tuple[float, float]  # noqa #815


class GeneratePaletteResponse(BaseModel):
    name: str
    swatches: list[GeneratePaletteSwatchResponse]


def map_generate_palette_to_response(
    color: str,
    percent_location: tuple[float, float],
) -> GeneratePaletteSwatchResponse:
    return GeneratePaletteSwatchResponse(
        color=color,
        percentLocation=(percent_location[0], percent_location[1]),
    )


def map_generate_palette_data_to_response(
    name: str,
    generated_palette: TGeneratedPalette,
) -> GeneratePaletteResponse:
    swatches = [
        map_generate_palette_to_response(item.color, item.percent_location)
        for item in generated_palette
    ]
    return GeneratePaletteResponse(name=name, swatches=swatches)


class SuccessResponse(BaseSuccessResponse):
    palettes: list[GeneratePaletteResponse]


# Define algorithms with their display names
ALGORITHMS = [
    ("K-Means Clustering", kmeans),
    ("Light Tones", lambda img: ciede2000(img, "light")),
    ("Dark Tones", lambda img: ciede2000(img, "dark")),
    ("Edge Detection", edge_colors),
    ("Warm & Cool", temperature_split),
    ("Most Vibrant", vibrance_peak),
    ("Perceptual Peaks", histogram_peaks),
    ("Median Cut", median_cut),
    ("Color Wheel", color_wheel_spread),
    ("Spatial Corners", spatial_corners),
]


def sort_swatches_by_color(swatches: list[TSwatch]) -> list[TSwatch]:
    """
    Sort swatches by color using HSL values.
    Orders by hue (rainbow order), then saturation, then lightness.
    Grayscale colors are placed at the end and sorted by lightness.
    """
    return sorted(swatches, key=lambda swatch: get_color_sort_key(swatch.color))


def handle_request(thumbnail: UploadFile):
    image = Image.open(thumbnail.file)

    scaled_image = scale_image(image, 100)

    rgb_image = convert_to_rgb(scaled_image)

    palettes = []
    for name, algorithm in ALGORITHMS:
        try:
            result = run_with_timeout(algorithm, (rgb_image,))
            if result is None:
                continue
            if len(result) == 6:
                sorted_swatches = sort_swatches_by_color(result)
                palettes.append(map_generate_palette_data_to_response(name, sorted_swatches))
        except Exception as e:
            continue

    return SuccessResponse(palettes=palettes)


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
