from io import BytesIO

import requests
from common.utils.photos import get_photo_path
from PIL import Image

from src.config import get_config

config = get_config()


def photo_path_to_bytes(photo_path: str) -> bytes:
    abs_image_path = get_photo_path(photo_path)

    if not config.is_production:
        # The development server gets stuck in an infinite loop requesting itself
        # while in the middle of a request. Therefore, hardcoding an image URL that works.
        abs_image_path = "https://res.cloudinary.com/hqjbxtyku/image/upload/f_auto,q_auto/359f027f-3ac4-4909-8662-b03027b11e60"

    response = requests.get(abs_image_path)
    response.raise_for_status()

    photo = Image.open(BytesIO(response.content)).convert("RGB")
    buf = BytesIO()
    photo.save(buf, format="WEBP")
    buf.seek(0)
    image_bytes = buf.read()
    return image_bytes


def photo_path_to_pil_image(photo_path: str) -> Image.Image:
    abs_image_path = get_photo_path(photo_path)

    if not config.is_production:
        # The development server gets stuck in an infinite loop requesting itself
        # while in the middle of a request. Therefore, hardcoding an image URL that works.
        abs_image_path = "https://res.cloudinary.com/hqjbxtyku/image/upload/f_auto,q_auto/359f027f-3ac4-4909-8662-b03027b11e60"

    response = requests.get(abs_image_path)
    response.raise_for_status()

    photo = Image.open(BytesIO(response.content)).convert("RGB")
    return photo
