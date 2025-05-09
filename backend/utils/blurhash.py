import base64
from io import BytesIO

import blurhash
import numpy as np
from PIL import Image


def encode_blurhash(image: Image.Image) -> str:
    """Encode an image into a blurhash string and base64 data URL."""
    # Generate blurhash
    hash_str = blurhash.encode(image, x_components=4, y_components=3)

    # Create a small placeholder image
    width, height = 32, 32
    pixels = np.array(blurhash.decode(hash_str, width, height))
    pixels = (pixels * 255).astype(np.uint8)  # Convert to uint8
    placeholder = Image.fromarray(pixels)

    # Convert to base64
    buffer = BytesIO()
    placeholder.save(buffer, format="JPEG", quality=50)
    base64_str = base64.b64encode(buffer.getvalue()).decode()

    return f"data:image/jpeg;base64,{base64_str}"
