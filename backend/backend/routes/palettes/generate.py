import io
import uuid

from fastapi import Form, UploadFile

from backend.algorithms.kmeans import get_image_colors
from backend.config import get_config
from backend.database.models import Palette
from backend.database.queries.palettes import create_palette
from backend.middleware.auth import RequestWithAuthState
from backend.services.logger import log_error
from backend.utils.photos import save_photo

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
        # Read the file content once
        photo_content = await photo.read()

        # Create a BytesIO object for get_image_colors
        photo_bytes = io.BytesIO(photo_content)
        colors = get_image_colors(photo_bytes)

        id = str(uuid.uuid4())

        photo_details = save_photo(photo_content, id, extension)

        palette = Palette(
            id=id,
            name="",
            app_user_id=request.state.app_user_id,
            photo_details=photo_details,
        )

        create_palette(palette)

        return {
            "success": True,
            "palette": colors,
            "paletteId": palette.id,
        }
    except Exception as error:
        log_error(error)
        return {
            "success": False,
            "error": "Failed to generate palette",
        }
