import os

from backend.config import get_config

config = get_config()


def get_uploads_dir():
    return os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")


def save_photo(photo: bytes, filename: str) -> str:
    if not config.is_production:
        uploads_dir = get_uploads_dir()
        os.makedirs(uploads_dir, exist_ok=True)
        file_path = os.path.join(uploads_dir, filename)
        with open(file_path, "wb") as f:
            f.write(photo)
        return f"/uploads/{filename}"
    else:
        raise Exception("Photo upload is not allowed in this environment")


def get_photo(filename: str) -> bytes:
    if not config.is_production:
        uploads_dir = get_uploads_dir()
        file_path = os.path.join(uploads_dir, filename)
        with open(file_path, "rb") as f:
            return f.read()
    else:
        raise Exception("Photo upload is not allowed in this environment")
