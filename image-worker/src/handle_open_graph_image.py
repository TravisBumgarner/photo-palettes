from common.models import ImageWorker, ImageWorkerStatusEnum, Palette
from common.queries.palettes import PaletteUpdate, update_palette
from common.queries.worker import (
    update_image_worker_status,
)
from common.utils.photos import save_photo
from PIL import Image

from src.config import get_config
from src.engine import db_engine
from src.logger import log_error
from src.og import generate_og_image

config = get_config()


def handle_open_graph_image(palette: Palette, photo: Image.Image, task: ImageWorker):
    try:
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
            db_engine=db_engine, worker_id=task.id, status=ImageWorkerStatusEnum.COMPLETED
        )
    except Exception as e:
        update_image_worker_status(
            db_engine=db_engine, worker_id=task.id, status=ImageWorkerStatusEnum.FAILED
        )
        log_error(e, "handle_open_graph_image")
