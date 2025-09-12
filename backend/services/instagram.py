import os
import tempfile
from io import BytesIO
from pathlib import Path

import requests
from instagrapi import Client
from PIL import Image, ImageDraw, ImageFont

from config import get_config
from database.queries.service_sessions import get_service_session, set_service_session

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

    image_to_draw = image_to_draw.resize(
        (resize_width, resize_height), Image.Resampling.BICUBIC
    )

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


def post_image(cl, image_paths, caption):
    cl.album_upload(paths=image_paths, caption=caption)
    print(f"Posted image: {image_paths}")
    return


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


def post_to_instagram(photo_path: str, colors: list[str], description: str) -> bool:
    service_name = "instagram"

    # Init client
    cl = Client()

    # Try loading existing session
    session_json = get_service_session(service_name)
    if session_json:
        cl.set_settings(session_json)

    try:
        cl.login(config.instagram.username, config.instagram.password)
    except Exception:
        # If login fails, reset and retry with fresh login
        cl.set_settings({})
        cl.login(config.instagram.username, config.instagram.password)

    # Save latest session back to DB
    set_service_session(service_name, cl.get_settings())

    # Generate images
    if not config.is_production:
        # I'm not sure why this is needed.
        # I copied the code for backfilling OG images and that works just fine.
        # However, if I use the abs_image_path above in development, the server gets
        # stuck in an infinite loop requesting itself while in the middle of a request.
        # Since this is only development, I'm hardcoding an image URL that I know works.
        photo_path = "https://res.cloudinary.com/hqjbxtyku/image/upload/f_auto,q_auto/359f027f-3ac4-4909-8662-b03027b11e60"

    response = requests.get(photo_path)
    response.raise_for_status()

    photo = Image.open(BytesIO(response.content)).convert("RGB")
    img_1 = generate_image_1(photo, colors)
    img_2 = generate_image_2(colors)

    # Post images (assuming helper handles in-memory uploads)
    post_image_from_memory(cl, [img_1, img_2], description)

    return True
