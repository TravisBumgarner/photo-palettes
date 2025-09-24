import uuid

from atproto import Client, client_utils

from src.config import get_config

bluesky_client: Client | None = None


config = get_config()


def get_bluesky_client() -> Client:
    """Return the initialized Bluesky client, or raise if not yet initialized."""
    if bluesky_client is None:
        raise RuntimeError("Bluesky client not initialized yet")
    return bluesky_client


def init_bluesky_client() -> None:
    global bluesky_client
    cfg = get_config()
    c = Client()
    print("About to login to Bluesky…")
    c.login(cfg.bluesky.email, cfg.bluesky.password)
    print("Login success")
    bluesky_client = c


def post_to_bluesky(
    title: str,
    colors: str,
    image_alt,
    palette_id: uuid.UUID,
    image_bytes: bytes,
    author_id: uuid.UUID,
    hashtags: list[str],
) -> None:
    client = get_bluesky_client()

    # Convert image to bytes (e.g., WEBP)

    text_builder = (
        client_utils.TextBuilder()
        .link(
            url=f"https://photopalettes.com/palette/{palette_id}",
            text=f"{title}",
        )
        .text(" by ")
        .link(
            url=f"https://photopalettes.com/profile/{author_id}",
            text=f"#{str(author_id)[:6]}",
        )
        .text(f"\n{colors}\n")
        .text(" ".join([f"#{tag}" for tag in hashtags]))
    )
    client.send_image(
        text=text_builder,
        image=image_bytes,  # Pass bytes, not a PIL Image
        image_alt=image_alt,
    )
