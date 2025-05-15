import time
import uuid
from io import BytesIO

from fastapi import Form, UploadFile
from PIL import Image

from algorithms.kmeans import get_image_colors
from algorithms.og import generate_og_image
from algorithms.utils import convert_to_rgb, scale_image
from config import get_config
from database.models import Palette
from database.queries.palettes import create_palette
from middleware.auth import RequestWithAuthState
from routes.palettes.palette_response_models import (
    map_generate_palette_array_to_response,
)
from services.logger import log_error
from utils.blurhash import encode_blurhash
from utils.photos import save_photo

from . import palettes_router

config = get_config()


def validate_request(photo: UploadFile):
    if photo.content_type not in ["image/png", "image/jpeg", "image/jpg"]:
        return {
            "success": False,
            "error": "Invalid file type",
        }

    return None


@palettes_router.post("/generate")
async def generate(
    request: RequestWithAuthState,
    photo: UploadFile,
    extension: str = Form(...),  # This grabs the extension from the form data.
):
    validation_error = validate_request(photo)
    if validation_error:
        return validation_error

    try:
        start_time = time.time()

        # Read the file content once and create BytesIO
        image = Image.open(photo.file)
        thumbnail = scale_image(image, 200)
        thumbnail = convert_to_rgb(thumbnail)
        colors = get_image_colors(thumbnail, str(request.state.app_user_id), start_time)

        id = uuid.uuid4()

        buffer = BytesIO()
        image.save(buffer, format="JPEG")
        img_bytes = buffer.getvalue()
        photo_details = save_photo(img_bytes, str(id), extension)

        hex_colors = [color["color"] for color in colors]
        og_image = generate_og_image(image, hex_colors)

        blurhash = encode_blurhash(thumbnail)

        og_photo_details = save_photo(og_image.getvalue(), f"{id!s}_og", "webp")

        palette = Palette(
            id=id,
            name="",
            app_user_id=request.state.app_user_id,
            photo_details=photo_details,
            og_photo_details=og_photo_details,
            blurhash=blurhash,
            aspect_ratio=image.width / image.height,
        )

        create_palette(palette)

        return {
            "success": True,
            "palette": map_generate_palette_array_to_response(colors),
            "paletteId": palette.id,
        }
    except Exception as error:
        log_error(error, "generate_palette")
        return {
            "success": False,
            "error": "Failed to generate palette",
        }
