from io import BytesIO

from fastapi import UploadFile
from PIL import Image


def scale_image(image: Image.Image, max_size: int) -> Image.Image:
    width, height = image.size
    if width > height:
        scale = max_size / width
    else:
        scale = max_size / height
    return image.resize((int(width * scale), int(height * scale)))


def convert_to_rgb(image: Image.Image) -> Image.Image:
    if image.mode != "RGB":
        return image.convert("RGB")
    return image


def open_image(photo: UploadFile) -> Image.Image:
    content = photo.file.read()
    image_bytes = BytesIO(content)
    image = Image.open(image_bytes)
    image = convert_to_rgb(image)
    return image


def rgb_to_hex(rgb: tuple[int, int, int]) -> str:
    return f"#{rgb[0]:02x}{rgb[1]:02x}{rgb[2]:02x}"
