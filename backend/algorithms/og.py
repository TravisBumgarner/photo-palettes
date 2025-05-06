import uuid
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

# Config
TARGET_WIDTH = 1200
TARGET_HEIGHT = 630
BLOCK_WIDTH = 210
BLOCK_HEIGHT = 105  # 630 / 6
FONT_PATH = Path(__file__).parent.parent / "fonts" / "AntonSC-Regular.ttf"
FONT = ImageFont.truetype(str(FONT_PATH), 48)


def get_text_color(hex_color):
    r, g, b = tuple(int(hex_color[i : i + 2], 16) for i in (1, 3, 5))
    luminance = 0.299 * r + 0.587 * g + 0.114 * b
    return "black" if luminance > 160 else "white"


# Process all images in input_dir
def generate_og_image(id: uuid.UUID, photo_content: BytesIO, colors: list[str]):
    image = Image.open(photo_content)
    image = image.convert("RGB")

    # Crop to fill 1200x630
    img_ratio = image.width / image.height
    target_ratio = TARGET_WIDTH / TARGET_HEIGHT

    if img_ratio > target_ratio:
        new_width = int(target_ratio * image.height)
        offset = (image.width - new_width) // 2
        image = image.crop((offset, 0, offset + new_width, image.height))
    else:
        new_height = int(image.width / target_ratio)
        offset = (image.height - new_height) // 2
        image = image.crop((0, offset, image.width, offset + new_height))

    # Use BICUBIC for better quality/size ratio than LANCZOS
    image = image.resize((TARGET_WIDTH, TARGET_HEIGHT), Image.Resampling.BICUBIC)

    # Create canvas
    canvas = Image.new("RGB", (TARGET_WIDTH, TARGET_HEIGHT), color="white")
    draw = ImageDraw.Draw(canvas)

    # Draw color swatches
    for i, hex_color in enumerate(colors):
        y0 = i * BLOCK_HEIGHT
        draw.rectangle([0, y0, BLOCK_WIDTH, y0 + BLOCK_HEIGHT], fill=hex_color)
        draw.text((10, y0 + 10), hex_color.upper(), fill=get_text_color(hex_color), font=FONT)

    # Paste processed image
    canvas.paste(image, (BLOCK_WIDTH, 0))

    # Get WebP bytes
    webp_bytes = BytesIO()
    canvas.save(webp_bytes, format="WEBP", quality=80, method=6)
    webp_bytes.seek(0)

    return webp_bytes
