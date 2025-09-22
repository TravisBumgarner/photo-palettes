from atproto import Client, client_utils

from src.config import get_config

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
    title: str, colors: str, image_alt, palette_id: str, image_bytes: bytes, author_id: str
) -> None:
    c = get_bsky_client()

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
            text=f"#{author_id[:6]}",
        )
        .text(f"\n{colors}")
    )
    c.send_image(
        text=text_builder,
        image=image_bytes,  # Pass bytes, not a PIL Image
        image_alt=image_alt,
    )
