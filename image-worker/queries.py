from common.models import ImageWorker, ImageWorkerStatusEnum
from sqlalchemy.orm import Session

from engine import db_engine

# All other operations are handled within the image-worker/ directory.


def get_next_image_worker():
    with Session(db_engine) as session:
        query = (
            session.query(ImageWorker)
            .filter(
                ImageWorker.status == ImageWorkerStatusEnum.PENDING,
            )
            .order_by(ImageWorker.created_at.asc())
            .limit(1)
        )

        return query.first()
