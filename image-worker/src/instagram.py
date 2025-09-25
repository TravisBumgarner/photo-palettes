import os
import tempfile
from pathlib import Path

from common.queries.service_session import (
    delete_service_session,
    get_service_session,
    set_service_session,
)
from instagrapi import Client
from PIL import Image, ImageDraw, ImageFont

from src.config import get_config
from src.engine import db_engine

TARGET_WIDTH = 1600
TARGET_HEIGHT = 1600
PADDING = 300
FONT_PATH = Path(__file__).parent.parent / "fonts" / "0xProto-Bold.ttf"
FONT_SIZE = 75
TEXT_HORIZONTAL_ORIGIN = 500
FONT = ImageFont.truetype(str(FONT_PATH), FONT_SIZE)

MIDDLE_GRAY = 255 // 2  # Approximate middle gray for luminance calculation

config = get_config()


def get_text_color(hex_color):
    r, g, b = tuple(int(hex_color[i : i + 2], 16) for i in (1, 3, 5))
    luminance = 0.299 * r + 0.587 * g + 0.114 * b
    return "black" if luminance > MIDDLE_GRAY else "white"


# Maybe use Instagram's supported aspect ratios to do this better.


def draw_background(og_image: Image.Image, colors: list[str]):
    draw = ImageDraw.Draw(og_image)

    n = len(colors)
    block_width = TARGET_WIDTH
    base_height = TARGET_HEIGHT // n
    extra_pixels = TARGET_HEIGHT % n

    # Distribute extra pixels: first 'extra_pixels' blocks get +1 pixel
    y_start = 0
    for i, hex_color in enumerate(colors):
        h = base_height + (1 if i < extra_pixels else 0)
        y_end = y_start + h
        draw.rectangle([0, y_start, block_width, y_end], fill=hex_color)
        y_start = y_end
    return og_image


def draw_image_1(og_image: Image.Image, image_to_draw: Image.Image):
    width, height = image_to_draw.size
    aspect_ratio = width / height

    if aspect_ratio >= 1:
        # Landscape or square
        resize_width = og_image.width - 2 * PADDING
        resize_height = int(resize_width / aspect_ratio)
        center_y_offset = (og_image.height - resize_height) // 2
        paste_y = center_y_offset
    else:
        # Portrait
        resize_height = og_image.height - 2 * PADDING
        resize_width = int(aspect_ratio * resize_height)
        paste_y = PADDING

    image_to_draw = image_to_draw.resize((resize_width, resize_height), Image.Resampling.BICUBIC)

    # Draw white border rectangle before pasting image
    border_thickness = 20
    draw = ImageDraw.Draw(og_image)
    left = PADDING - border_thickness
    top = paste_y - border_thickness
    right = PADDING + resize_width + border_thickness
    bottom = paste_y + resize_height + border_thickness
    draw.rectangle([left, top, right, bottom], outline="white", width=border_thickness)

    og_image.paste(image_to_draw, (PADDING, paste_y))
    return og_image


def generate_image_1(photo: Image.Image, colors: list[str]):
    image = Image.new("RGB", (TARGET_WIDTH, TARGET_HEIGHT), "white")
    image = draw_background(image, colors)
    image = draw_image_1(image, photo)

    return image


def draw_text_2(image: Image.Image, colors: list[str]):
    draw = ImageDraw.Draw(image)
    block_height = TARGET_HEIGHT // len(colors)

    # Draw text on each color block, right-aligned near the edge
    for i, hex_color in enumerate(colors):
        y0 = int(i * block_height + block_height // 2)
        text = hex_color.upper()
        text_width = draw.textlength(text, font=FONT)
        # Place text close to the right edge, with a small margin
        margin = 40
        x_right = TARGET_WIDTH - margin
        x0 = x_right - text_width
        draw.text(
            (x0, y0),
            text,
            fill=get_text_color(hex_color),
            font=FONT,
            anchor="lm",  # left-middle anchor for right alignment
        )
    return image


def generate_image_2(colors: list[str]):
    image = Image.new("RGB", (TARGET_WIDTH, TARGET_HEIGHT), "white")
    image = draw_background(image, colors)
    image = draw_text_2(image, colors)

    return image


def post_image_from_memory(cl, pil_images, caption):
    temp_files = []
    for img in pil_images:
        temp = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False)
        img.save(temp.name, format="JPEG")
        temp_files.append(Path(temp.name))
        temp.close()
    cl.album_upload(paths=temp_files, caption=caption)
    # Optionally, delete temp files after upload
    for temp_path in temp_files:
        os.remove(temp_path)


def post_to_instagram(
    title: str,
    caption: str,
    colors: list[str],
    image: Image.Image,
    hashtags: list[str],
) -> None:
    service_name = "instagram"
    client = Client()

    # Try loading existing session
    session_json = get_service_session(db_engine, service_name)
    if session_json:
        client.set_settings(session_json)
        try:
            client.get_timeline_feed()  # lightweight request to verify session is valid
        except Exception:
            # Session expired -> reset and re-login
            client.set_settings({})
            delete_service_session(db_engine, service_name)
    else:
        # No valid session, so login fresh
        client.login(config.instagram.username, config.instagram.password)

    # Save latest session back to DB
    set_service_session(db_engine, service_name, client.get_settings())

    img_1 = generate_image_1(image, colors)
    img_2 = generate_image_2(colors)

    text = f"{title}\n"
    if caption:
        text += f"{caption}\n"

    text += "\n" + " ".join([f"#{tag}" for tag in hashtags])

    # Post images (assuming helper handles in-memory uploads)
    post_image_from_memory(client, [img_1, img_2], text)
