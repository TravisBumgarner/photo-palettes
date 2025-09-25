import uuid

import tweepy

from src.config import get_config

twitter_client: tweepy.Client | None = None

import io

import tweepy

twitter_client: tweepy.Client | None = None
twitter_api_v1: tweepy.API | None = None

config = get_config()


def get_twitter_client() -> tweepy.Client:
    if twitter_client is None:
        raise RuntimeError("Twitter client not initialized yet")
    return twitter_client


def get_twitter_api_v1() -> tweepy.API:
    if twitter_api_v1 is None:
        raise RuntimeError("Twitter v1.1 API not initialized yet")
    return twitter_api_v1


def init_twitter_clients() -> None:
    """Init v2 Client (tweet) + v1.1 API (media upload + alt text)."""
    print("initting twitter clients...")  # noqa T201
    global twitter_client, twitter_api_v1

    # v2 Client (creates the Tweet)
    twitter_client = tweepy.Client(
        consumer_key=config.twitter.api_key,
        consumer_secret=config.twitter.api_key_secret,
        access_token=config.twitter.access_token,
        access_token_secret=config.twitter.access_token_secret,
    )

    # v1.1 API (uploads media + alt text)
    auth = tweepy.OAuth1UserHandler(
        consumer_key=config.twitter.api_key,
        consumer_secret=config.twitter.api_key_secret,
        access_token=config.twitter.access_token,
        access_token_secret=config.twitter.access_token_secret,
    )
    twitter_api_v1 = tweepy.API(auth)


def post_to_twitter(
    title: str,
    caption: str,
    colors: str,
    image_alt: str | None,
    palette_id: uuid.UUID,
    image_bytes: bytes,
    author_id: uuid.UUID,
    hashtags: list[str],
) -> None:
    client = get_twitter_client()
    api_v1 = get_twitter_api_v1()

    # 1) Upload media via v1.1 (can pass a BytesIO + a filename for MIME sniffing)
    media = api_v1.media_upload(
        filename="palette.jpg",  # filename is required even if file=... is used
        file=io.BytesIO(image_bytes),
    )

    # 2) Optional: add alt text (accessibility)
    if image_alt:
        api_v1.create_media_metadata(media.media_id, image_alt)

    # 3) Build tweet text
    lines = []
    lines.append(f"{title} by user #{str(author_id)[:6]}\n")
    lines.append(f"Colors: {colors}\n")

    if caption:
        lines.append(f"{caption}\n")

    lines.append(f"https://photopalettes.com/palette/{palette_id}\n\n")

    if hashtags:
        lines.append(" ".join(f"#{t}" for t in hashtags))
    text = "".join(lines)

    # 4) Create the Tweet via v2
    client.create_tweet(text=text, media_ids=[media.media_id])
