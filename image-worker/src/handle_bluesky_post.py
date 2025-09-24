import json
from io import BytesIO

from common.models import BlueskyPostData, ImageWorker, ImageWorkerStatusEnum, Palette
from common.queries.worker import (
    update_image_worker_status,
)
from PIL import Image

from src.bluesky import post_to_bluesky
from src.config import get_config
from src.engine import db_engine
from src.logger import log_error

config = get_config()


def handle_bluesky_post(palette: Palette, photo: Image.Image, task: ImageWorker):
    try:
        hex_colors = " ".join([color.hex for color in palette.colors])

        buf = BytesIO()
        photo.save(buf, format="WEBP")
        buf.seek(0)
        image_bytes = buf.read()

        post_data = BlueskyPostData.model_validate_json(json.dumps(task.json_data))

        post_to_bluesky(
            title=post_data.caption,
            colors=hex_colors,
            image_alt=post_data.caption,
            image_bytes=image_bytes,
            author_id=palette.app_user_id,
            palette_id=palette.id,
            hashtags=post_data.hashtags,
        )

        update_image_worker_status(
            db_engine=db_engine, worker_id=task.id, status=ImageWorkerStatusEnum.COMPLETED
        )
    except Exception as e:
        update_image_worker_status(
            db_engine=db_engine, worker_id=task.id, status=ImageWorkerStatusEnum.FAILED
        )
        log_error(e, "handle_bluesky_post")
