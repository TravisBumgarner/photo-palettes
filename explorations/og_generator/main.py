import datetime
import io
import os

from PIL import Image, ImageDraw, ImageFont

# Sample KMeans colors (replace this with your real logic)
kmeans_colors = ["#949088", "#34373B", "#D5D7D5", "#1179AA", "#C89A00", "#8F1C27"]

input_dir = "./input"
output_dir = "./uploads"

# Create output directory if it doesn't exist
os.makedirs(output_dir, exist_ok=True)

# Config
target_width = 1200
target_height = 630
block_width = 210
block_height = 105  # 630 / 6
font = ImageFont.truetype("./AntonSC-Regular.ttf", 48)


def get_text_color(hex_color):
    r, g, b = tuple(int(hex_color[i : i + 2], 16) for i in (1, 3, 5))
    luminance = 0.299 * r + 0.587 * g + 0.114 * b
    return "black" if luminance > 160 else "white"


# Process all images in input_dir
for filename in os.listdir(input_dir):
    if not filename.lower().endswith(
        (".png", ".jpg", ".jpeg", ".webp", ".bmp", ".gif")
    ):
        continue

    input_path = os.path.join(input_dir, filename)
    image = Image.open(input_path).convert("RGB")

    # Crop to fill 990x630
    img_ratio = image.width / image.height
    target_ratio = target_width / target_height

    if img_ratio > target_ratio:
        new_width = int(target_ratio * image.height)
        offset = (image.width - new_width) // 2
        image = image.crop((offset, 0, offset + new_width, image.height))
    else:
        new_height = int(image.width / target_ratio)
        offset = (image.height - new_height) // 2
        image = image.crop((0, offset, image.width, offset + new_height))

    # Use BICUBIC for better quality/size ratio than LANCZOS
    image = image.resize((target_width, target_height), Image.Resampling.BICUBIC)

    # Create canvas
    canvas = Image.new("RGB", (1200, 630), color="white")
    draw = ImageDraw.Draw(canvas)

    # Draw color swatches
    for i, hex_color in enumerate(kmeans_colors):
        y0 = i * block_height
        draw.rectangle([0, y0, block_width, y0 + block_height], fill=hex_color)
        draw.text(
            (10, y0 + 10), hex_color.upper(), fill=get_text_color(hex_color), font=font
        )

    # Paste processed image
    canvas.paste(image, (block_width, 0))

    # Create output file name
    name, ext = os.path.splitext(filename)
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    output_filename = f"{name}_palette_{timestamp}.webp"
    output_path = os.path.join(output_dir, output_filename)

    # Get WebP bytes
    webp_bytes = io.BytesIO()
    canvas.save(webp_bytes, format="WEBP", quality=80, method=6)
    webp_bytes.seek(0)

    # For local dev, save to file
    with open(output_path, "wb") as f:
        f.write(webp_bytes.getvalue())
    print(f"✅ Saved: {output_path}")

    # For prod, you can now use webp_bytes with Cloudinary:
    # cloudinary.uploader.upload(webp_bytes, ...)
