import time

import sentry_sdk
from common.models import ImageWorkerActionEnum, ImageWorkerStatusEnum
from common.queries.palettes import get_palette_by_id
from common.queries.worker import (
    get_next_image_worker,
    update_image_worker_status,
)
from common.services.cloudinary import init_cloudinary

from src.bluesky import init_bluesky_client
from src.config import get_config
from src.engine import db_engine
from src.handle_bluesky_post import handle_bluesky_post
from src.handle_instagram_post import handle_instagram_post
from src.handle_open_graph_image import handle_open_graph_image
from src.logger import log_error

print("Starting image-worker...")  # noqa T201

config = get_config()

if config.is_production:
    SLEEP = 60
    sentry_sdk.init(
        dsn="https://49e9a542e6aab66deac28daccfb162f5@o196886.ingest.us.sentry.io/4510043657207808",
        # Add data like request headers and IP for users,
        # see https://docs.sentry.io/platforms/python/data-management/data-collected/ for more info
        send_default_pii=True,
    )
else:
    SLEEP = 10


init_bluesky_client()
init_cloudinary(config.cloudinary.url)

while True:
    task = get_next_image_worker(db_engine=db_engine)
    if not task:
        time.sleep(SLEEP)
        continue

    palette = get_palette_by_id(db_engine=db_engine, palette_id=task.palette_id)
    if not palette:
        log_error(
            Exception("Palette not found"),
            "image_worker_palette_not_found",
            sub_name=str(task.palette_id),
        )
        update_image_worker_status(
            db_engine=db_engine, worker_id=task.id, status=ImageWorkerStatusEnum.FAILED
        )
        continue

    print(f"Worker ready to process: {task.id} for palette {palette.id}")  # noqa T201

    match task.action_type:
        case ImageWorkerActionEnum.GENERATE_OG:
            handle_open_graph_image(palette, task)

        case ImageWorkerActionEnum.POST_TO_BLUESKY:
            handle_bluesky_post(palette, task)

        case ImageWorkerActionEnum.POST_TO_INSTAGRAM:
            handle_instagram_post(palette, task)
