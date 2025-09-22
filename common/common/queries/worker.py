import uuid

from sqlalchemy import func
from sqlalchemy.orm import Session

from common.models import (
    ImageWorker,
    ImageWorkerStatusEnum,
)


def get_next_image_worker(db_engine):
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


def update_image_worker_status(
    db_engine, worker_id: uuid.UUID, status: ImageWorkerStatusEnum
) -> bool:
    with Session(db_engine) as session:
        worker = session.query(ImageWorker).filter(ImageWorker.id == worker_id).first()
        if not worker:
            return False
        worker.status = status
        worker.processed_at = func.now()
        session.commit()
        return True
