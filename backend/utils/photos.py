import os

from config import get_config
from services.cloudinary import (
    delete_image_from_cloudinary,
    get_image_from_cloudinary,
    save_image_to_cloudinary,
)

config = get_config()

DEVELOPMENT_UPLOADS_DIR = "uploads"
DEVELOPMENT_UPLOADS_PREFIX = f"/{DEVELOPMENT_UPLOADS_DIR}"
PRODUCTION_UPLOADS_PREFIX = "cloudinary:"


def get_development_uploads_dir():
    return os.path.join(os.path.dirname(os.path.dirname(__file__)), DEVELOPMENT_UPLOADS_DIR)


def save_photo(photo: bytes, basename: str, extension: str) -> str:
    if config.is_production:
        result = save_image_to_cloudinary(photo, basename)
        return f"{PRODUCTION_UPLOADS_PREFIX}/{result}"
    else:
        filename = f"{basename}.{extension}"
        uploads_dir = get_development_uploads_dir()
        os.makedirs(uploads_dir, exist_ok=True)
        file_path = os.path.join(uploads_dir, filename)
        with open(file_path, "wb") as f:
            f.write(photo)
        return f"{DEVELOPMENT_UPLOADS_PREFIX}/{filename}"


def get_photo_path(photo_details: str) -> str:
    # More so for development, this will return images from cloudinary and local storage depending
    # on the prefix and not the environment.
    if photo_details.startswith(PRODUCTION_UPLOADS_PREFIX):
        public_id = photo_details.replace(PRODUCTION_UPLOADS_PREFIX, "")
        return get_image_from_cloudinary(public_id)

    return f"http://backend:8000{photo_details}"


def delete_photo(photo_details: str) -> None:
    if photo_details.startswith(PRODUCTION_UPLOADS_PREFIX):
        public_id = photo_details.replace(PRODUCTION_UPLOADS_PREFIX, "")
        return delete_image_from_cloudinary(public_id)

    # For local development, we can just remove the file from the filesystem
    file_path = os.path.join(get_development_uploads_dir(), os.path.basename(photo_details))
    if os.path.exists(file_path):
        os.remove(file_path)
