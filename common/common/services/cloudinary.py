import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url


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


def init_cloudinary(cloudinary_url: str):
    cloudinary.config(
        **parse_cloudinary_url(cloudinary_url),
        secure=True,
    )


def save_image_to_cloudinary(image_bytes: bytes, public_id: str) -> str:
    upload_result = cloudinary.uploader.upload(
        image_bytes,
        public_id=public_id,
        overwrite=True,
        invalidate=True,
    )
    return upload_result["public_id"]


def get_image_from_cloudinary(public_id: str) -> str:
    return cloudinary_url(public_id, fetch_format="auto", quality="auto")[0]


def delete_image_from_cloudinary(public_id: str) -> None:
    cloudinary.uploader.destroy(public_id)
