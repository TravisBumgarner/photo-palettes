import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url

from backend.config import get_config

config = get_config()

print("config", config)

# Configuration


def parse_cloudinary_url(cloudinary_url: str) -> dict[str, str]:
    # cloudinary_url is in the format of cloudinary://<API_KEY>:<API_SECRET>@<CLOUD_NAME>
    # It looks like the only way to pass it in is to skip the config file. I don't want to do that.

    cloudinary_url = cloudinary_url.replace("cloudinary://", "")
    [api_key, rest] = cloudinary_url.split(":")
    [api_secret, cloud_name] = rest.split("@")

    return {
        "cloud_name": cloud_name,
        "api_key": api_key,
        "api_secret": api_secret,
    }


cloudinary.config(
    **parse_cloudinary_url(config.cloudinary_url),
    secure=True,
)


def save_image_to_cloudinary(image_bytes: bytes, public_id: str) -> str:
    print("config", config)
    upload_result = cloudinary.uploader.upload(image_bytes, public_id=public_id)
    print("upload_result", upload_result)
    return upload_result["public_id"]


def get_image_from_cloudinary(public_id: str) -> str:
    return cloudinary_url(public_id, fetch_format="auto", quality="auto")[0]
