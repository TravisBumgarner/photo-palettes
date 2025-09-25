import json

from common.models import ImageWorker, ImageWorkerStatusEnum, InstagramPostData, Palette
from common.queries.worker import (
    update_image_worker_status,
)

from src.config import get_config
from src.engine import db_engine
from src.instagram import post_to_instagram
from src.logger import log_error
from src.utilites import photo_path_to_pil_image

config = get_config()


def handle_instagram_post(palette: Palette, task: ImageWorker):
    try:
        image = photo_path_to_pil_image(palette.photo_details)
        hex_colors = [color.hex for color in palette.colors]

        post_data = InstagramPostData.model_validate_json(json.dumps(task.json_data))

        post_to_instagram(
            caption=post_data.caption,
            title=palette.name,
            colors=hex_colors,
            image=image,
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
