from io import BytesIO

import requests
from atproto import Client, client_utils
from config import get_config
from PIL import Image
from utils.photos import get_photo_path

bsky_client: Client | None = None


config = get_config()


def get_bsky_client() -> Client:
    """Return the initialized Bluesky client, or raise if not yet initialized."""
    if bsky_client is None:
        raise RuntimeError("Bluesky client not initialized yet")
    return bsky_client


def init_bsky_client() -> None:
    global bsky_client
    cfg = get_config()
    c = Client()
    print("About to login to Bluesky…")
    c.login(cfg.bsky.email, cfg.bsky.password)
    print("Login success")
    bsky_client = c


def post_to_bsky(
    title: str, colors: str, image_alt, palette_id: str, image_path: str, author_id: str
) -> None:
    c = get_bsky_client()
    abs_image_path = get_photo_path(image_path)

    if not config.is_production:
        # I'm not sure why this is needed.
        # I copied the code for backfilling OG images and that works just fine.
        # However, if I use the abs_image_path above in development, the server gets
        # stuck in an infinite loop requesting itself while in the middle of a request.
        # Since this is only development, I'm hardcoding an image URL that I know works.
        abs_image_path = "https://res.cloudinary.com/hqjbxtyku/image/upload/v1757012480/57cfd5bd-1b59-43b5-9afa-f5e444b602ef_og.webp"

    response = requests.get(abs_image_path)
    response.raise_for_status()

    # Convert image to bytes (e.g., WEBP)
    image = Image.open(BytesIO(response.content))
    buf = BytesIO()
    image.save(buf, format="WEBP")
    buf.seek(0)
    image_bytes = buf.read()
    text_builder = (
        client_utils.TextBuilder()
        .link(
            url=f"https://photopalettes.com/palette/{palette_id}",
            text=f"{title}",
        )
        .text(" by ")
        .link(
            url=f"https://photopalettes.com/profile/{author_id}",
            text=f"#{author_id[:6]}",
        )
        .text(f"\n{colors}")
    )
    c.send_image(
        text=text_builder,
        image=image_bytes,  # Pass bytes, not a PIL Image
        image_alt=image_alt,
    )
