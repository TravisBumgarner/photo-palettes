from io import BytesIO
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

# Config
TARGET_WIDTH = 1200
TARGET_HEIGHT = 630
FONT_PATH = Path(__file__).parent.parent / "fonts" / "0xProto-Bold.ttf"

FONT_SIZE = 30
FONT = ImageFont.truetype(str(FONT_PATH), FONT_SIZE)

TEXT_HORIZONTAL_ORIGIN = 100
ESTIMATED_TEXT_WIDTH = FONT.getbbox("#AAAAAA")[2] - FONT.getbbox("#AAAAAA")[0]

TEXT_PADDING = TEXT_HORIZONTAL_ORIGIN - ESTIMATED_TEXT_WIDTH // 2
MARGIN_WIDTH = 10

LEFT_MARGIN_HORIZONTAL_ORIGIN = TEXT_HORIZONTAL_ORIGIN + ESTIMATED_TEXT_WIDTH // 2 + TEXT_PADDING

IMAGE_HORIZONTAL_ORIGIN = LEFT_MARGIN_HORIZONTAL_ORIGIN + MARGIN_WIDTH

MIDDLE_GRAY = 160


def get_text_color(hex_color):
    r, g, b = tuple(int(hex_color[i : i + 2], 16) for i in (1, 3, 5))
    luminance = 0.299 * r + 0.587 * g + 0.114 * b
    return "black" if luminance > MIDDLE_GRAY else "white"


def draw_background(og_image: Image, colors: list[str]):
    draw = ImageDraw.Draw(og_image)

    block_height = TARGET_HEIGHT // len(colors)
    block_width = TARGET_WIDTH

    # Draw each color block
    for i, hex_color in enumerate(colors):
        draw.rectangle([0, i * block_height, block_width, (i + 1) * block_height], fill=hex_color)
    return og_image


def draw_text(og_image: Image, colors: list[str]):
    draw = ImageDraw.Draw(og_image)
    block_height = TARGET_HEIGHT // len(colors)

    # Draw text on each color block
    for i, hex_color in enumerate(colors):
        y0 = int(i * block_height + block_height // 2)
        x0 = int(TEXT_HORIZONTAL_ORIGIN)
        draw.text(
            (x0, y0),
            hex_color.upper(),
            fill=get_text_color(hex_color),
            font=FONT,
            anchor="mm",
        )
    return og_image


def draw_left_margin(og_image: Image):
    draw = ImageDraw.Draw(og_image)
    draw.rectangle(
        [
            LEFT_MARGIN_HORIZONTAL_ORIGIN,
            0,
            LEFT_MARGIN_HORIZONTAL_ORIGIN + MARGIN_WIDTH,
            TARGET_HEIGHT,
        ],
        fill="white",
    )
    return og_image


def draw_image(og_image: Image, image_to_draw: Image):
    width, height = image_to_draw.size
    aspect_ratio = width / height

    resize_height = og_image.height
    resize_width = int(aspect_ratio * resize_height)

    image_to_draw = image_to_draw.resize((resize_width, resize_height), Image.Resampling.BICUBIC)
    # Optionally center horizontally, or keep at x=100
    og_image.paste(image_to_draw, (IMAGE_HORIZONTAL_ORIGIN, 0))
    return (og_image, resize_width)


def draw_right_margin(og_image: Image, image_resize_width: int):
    draw = ImageDraw.Draw(og_image)
    draw.rectangle(
        [
            IMAGE_HORIZONTAL_ORIGIN + image_resize_width,
            0,
            IMAGE_HORIZONTAL_ORIGIN + image_resize_width + MARGIN_WIDTH,
            TARGET_HEIGHT,
        ],
        fill="white",
    )
    return og_image


# Process all images in input_dir
def generate_og_image(image_to_draw: Image.Image, colors: list[str]):
    og_image = Image.new("RGB", (TARGET_WIDTH, TARGET_HEIGHT), color="white")
    og_image = draw_background(og_image, colors=colors)
    og_image = draw_text(og_image, colors=colors)
    og_image = draw_left_margin(og_image)
    (og_image, resize_width) = draw_image(og_image, image_to_draw=image_to_draw)
    og_image = draw_right_margin(og_image, image_resize_width=resize_width)

    # Get WebP bytes
    webp_bytes = BytesIO()
    og_image.save(webp_bytes, format="WEBP", quality=100, method=6)
    webp_bytes.seek(0)

    return webp_bytes
