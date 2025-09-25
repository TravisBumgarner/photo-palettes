import json

from common.models import BlueskyPostData, ImageWorker, ImageWorkerStatusEnum, Palette
from common.queries.worker import (
    update_image_worker_status,
)

from src.bluesky import post_to_bluesky
from src.config import get_config
from src.engine import db_engine
from src.logger import log_error
from src.utilites import photo_path_to_bytes

config = get_config()


def handle_bluesky_post(palette: Palette, task: ImageWorker):
    try:
        image_bytes = photo_path_to_bytes(palette.og_photo_details)
        hex_colors = " ".join([color.hex for color in palette.colors])

        post_data = BlueskyPostData.model_validate_json(json.dumps(task.json_data))

        post_to_bluesky(
            title=palette.name,
            caption=post_data.caption,
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
