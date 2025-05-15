import blurhash
from PIL import Image


def encode_blurhash(image: Image.Image) -> str:
    """Encode an image into a blurhash string and base64 data URL."""
    # Generate blurhash
    hash_str = blurhash.encode(image, x_components=6, y_components=6)
    return hash_str
