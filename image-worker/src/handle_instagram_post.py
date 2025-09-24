import json

from common.models import ImageWorker, ImageWorkerStatusEnum, InstagramPostData, Palette
from common.queries.worker import (
    update_image_worker_status,
)
from PIL import Image

from src.config import get_config
from src.engine import db_engine
from src.instagram import post_to_instagram
from src.logger import log_error

config = get_config()


def handle_instagram_post(palette: Palette, image: Image.Image, task: ImageWorker):
    try:
        hex_colors = [color.hex for color in palette.colors]

        post_data = InstagramPostData.model_validate_json(json.dumps(task.json_data))

        post_to_instagram(
            caption=post_data.caption,
            colors=hex_colors,
            image_alt=post_data.caption,
            image=image,
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
        log_error(e, "handle_instagram_post")
