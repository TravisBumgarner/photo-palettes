import io
import time
import uuid

from fastapi import Form, UploadFile

from algorithms.kmeans import get_image_colors
from algorithms.og import generate_og_image
from config import get_config
from database.models import Palette
from database.queries.palettes import create_palette
from middleware.auth import RequestWithAuthState
from routes.palettes.palette_response_models import (
    map_generate_palette_array_to_response,
)
from services.logger import log_error
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
        print(f"[BENCHMARK:{request.state.app_user_id}]: generate called", start_time)

        # Read the file content once and create BytesIO
        photo_bytes = io.BytesIO(await photo.read())
        print(
            f"[BENCHMARK:{request.state.app_user_id}]: photo_bytes created",
            time.time() - start_time,
        )

        colors = get_image_colors(photo_bytes, str(request.state.app_user_id), start_time)
        print(f"[BENCHMARK:{request.state.app_user_id}]: colors created", time.time() - start_time)

        id = uuid.uuid4()
        photo_details = save_photo(photo_bytes.getvalue(), str(id), extension)
        print(
            f"[BENCHMARK:{request.state.app_user_id}]: photo_details created",
            time.time() - start_time,
        )
        hex_colors = [color["color"] for color in colors]
        og_image = generate_og_image(id, photo_bytes, hex_colors)
        print(
            f"[BENCHMARK:{request.state.app_user_id}]: og_image created", time.time() - start_time
        )
        og_photo_details = save_photo(og_image.getvalue(), f"{id!s}_og", "webp")
        print(
            f"[BENCHMARK:{request.state.app_user_id}]: og_photo_details created",
            time.time() - start_time,
        )

        palette = Palette(
            id=id,
            name="",
            app_user_id=request.state.app_user_id,
            photo_details=photo_details,
            og_photo_details=og_photo_details,
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
