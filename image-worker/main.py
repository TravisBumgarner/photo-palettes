import time
from io import BytesIO

import requests
import sentry_sdk
from common.models import ImageWorkerActionEnum, ImageWorkerStatusEnum
from common.queries.palettes import PaletteUpdate, get_palette_by_id, update_palette
from common.queries.worker import (
    get_next_image_worker,
    update_image_worker_status,
)
from common.services.cloudinary import init_cloudinary
from common.utils.photos import get_photo_path, save_photo
from PIL import Image

from src.bsky import init_bsky_client
from src.config import get_config
from src.engine import db_engine
from src.logger import log_error
from src.og import generate_og_image

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


init_bsky_client()
init_cloudinary(config.cloudinary.url)

while True:
    obj = get_next_image_worker(db_engine=db_engine)
    if not obj:
        time.sleep(SLEEP)
        continue

    palette = get_palette_by_id(db_engine=db_engine, palette_id=obj.palette_id)
    if not palette:
        log_error(
            Exception("Palette not found"),
            "image_worker_palette_not_found",
            sub_name=str(obj.palette_id),
        )
        update_image_worker_status(
            db_engine=db_engine, worker_id=obj.id, status=ImageWorkerStatusEnum.FAILED
        )
        continue

    print(f"Worker ready to process: {obj.id} for palette {palette.id}")

    abs_image_path = get_photo_path(palette.photo_details)

    if not config.is_production:
        # I'm not sure why this is needed.
        # I copied the code for backfilling OG images and that works just fine.
        # However, if I use the abs_image_path above in development, the server gets
        # stuck in an infinite loop requesting itself while in the middle of a request.
        # Since this is only development, I'm hardcoding an image URL that I know works.
        abs_image_path = "https://res.cloudinary.com/hqjbxtyku/image/upload/f_auto,q_auto/359f027f-3ac4-4909-8662-b03027b11e60"

    response = requests.get(abs_image_path)
    response.raise_for_status()

    photo = Image.open(BytesIO(response.content)).convert("RGB")

    match obj.action_type:
        case ImageWorkerActionEnum.GENERATE_OG:
            hex_colors = [color.hex for color in palette.colors]
            og_image = generate_og_image(photo, hex_colors)
            og_photo_details = save_photo(
                is_production=config.is_production,
                debug_cloudinary_locally=False,
                photo=og_image.getvalue(),
                basename=f"{palette.id!s}_og",
                extension="webp",
            )

            update_palette(
                db_engine=db_engine,
                palette_id=palette.id,
                update=PaletteUpdate(og_photo_details=og_photo_details),
            )

            update_image_worker_status(
                db_engine=db_engine, worker_id=obj.id, status=ImageWorkerStatusEnum.COMPLETED
            )

        case ImageWorkerActionEnum.POST_TO_BSKY:
            pass

        case ImageWorkerActionEnum.POST_TO_INSTAGRAM:
            pass
