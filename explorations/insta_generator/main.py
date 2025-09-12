import os

from PIL import Image, ImageDraw, ImageFont

TARGET_WIDTH = 1600
TARGET_HEIGHT = 1600
PADDING = 150
FONT_PATH = "font2.ttf"
FONT_SIZE = 200
TEXT_HORIZONTAL_ORIGIN = 500
FONT = ImageFont.truetype(str(FONT_PATH), FONT_SIZE)

MIDDLE_GRAY = 186  # Approximate middle gray for luminance calculation


def get_text_color(hex_color):
    r, g, b = tuple(int(hex_color[i : i + 2], 16) for i in (1, 3, 5))
    luminance = 0.299 * r + 0.587 * g + 0.114 * b
    return "black" if luminance > MIDDLE_GRAY else "white"


# Maybe use Instagram's supported aspect ratios to do this better.


def draw_background(og_image: Image.Image, colors: list[str]):
    draw = ImageDraw.Draw(og_image)

    block_height = TARGET_HEIGHT // len(colors)
    block_width = TARGET_WIDTH

    # Draw each color block
    for i, hex_color in enumerate(colors):
        draw.rectangle(
            [0, i * block_height, block_width, (i + 1) * block_height], fill=hex_color
        )
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


def generate_image_1(file_path):
    photo = Image.open(file_path)
    image = Image.new("RGB", (TARGET_WIDTH, TARGET_HEIGHT), "white")
    image = draw_background(
        image, ["#35000C", "#041C1E", "#75111B", "#8A390E", "#6E716B", "#93AAA4"]
    )
    image = draw_image_1(image, photo)

    if not os.path.exists("output"):
        os.makedirs("output")
    image.save(f"output/1{file_path}")


def draw_text_2(og_image: Image.Image, colors: list[str]):
    draw = ImageDraw.Draw(og_image)
    block_height = TARGET_HEIGHT // len(colors)

    # Draw text on each color block
    for i, hex_color in enumerate(colors):
        y0 = int(i * block_height + block_height // 2)
        x_right = TARGET_WIDTH - PADDING
        text_width = draw.textlength(hex_color.upper(), font=FONT)
        x0 = x_right - text_width // 2
        draw.text(
            (x0, y0),
            hex_color.upper(),
            fill=get_text_color(hex_color),
            font=FONT,
            anchor="mm",
        )
    return og_image


def generate_image_2(file_path):
    image = Image.new("RGB", (TARGET_WIDTH, TARGET_HEIGHT), "white")
    image = draw_background(
        image, ["#35000C", "#041C1E", "#75111B", "#8A390E", "#6E716B", "#93AAA4"]
    )
    image = draw_text_2(
        image, ["#35000C", "#041C1E", "#75111B", "#8A390E", "#6E716B", "#93AAA4"]
    )
    if not os.path.exists("output"):
        os.makedirs("output")
    image.save(f"output/2{file_path}")


generate_image_1("landscape.webp")
generate_image_1("portrait.jpeg")
generate_image_2("landscape.webp")
generate_image_2("portrait.jpeg")
