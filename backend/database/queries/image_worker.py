from sqlalchemy.orm import Session

from database.engine import db_engine
from common.models import ImageWorker, ImageWorkerJobEnum

# All other operations are handled within the image-worker/ directory.


def insert_image_worker(palette_id: str, action_type: ImageWorkerJobEnum):
    with Session(db_engine) as session:
        worker = ImageWorker(
            palette_id=palette_id,
            action_type=action_type,
        )
        session.add(worker)
    session.commit()
    session.refresh(worker)
    return worker
