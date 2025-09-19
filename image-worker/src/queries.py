import uuid

from common.models import (
    ImageWorker,
    ImageWorkerStatusEnum,
    Palette,
    PaletteFavorite,
    ServiceSession,
)
from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload

from src.engine import db_engine


def get_service_session(service: str) -> dict | None:
    with Session(db_engine) as session:
        stmt = select(ServiceSession).where(ServiceSession.service == service)
        result = session.execute(stmt).scalar_one_or_none()
        return result.session_json if result else None


def set_service_session(service: str, session_json: dict) -> bool:
    with Session(db_engine) as session:
        stmt = select(ServiceSession).where(ServiceSession.service == service)
        result = session.execute(stmt).scalar_one_or_none()

        if result:
            result.session_json = session_json
        else:
            result = ServiceSession(service=service, session_json=session_json)
            session.add(result)

        session.commit()
        return True


def delete_service_session(service: str) -> bool:
    with Session(db_engine) as session:
        stmt = select(ServiceSession).where(ServiceSession.service == service)
        result = session.execute(stmt).scalar_one_or_none()

        if result:
            session.delete(result)
            session.commit()
            return True
        return False


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


def update_image_worker_status(worker_id: uuid.UUID, status: ImageWorkerStatusEnum) -> bool:
    with Session(db_engine) as session:
        worker = session.query(ImageWorker).filter(ImageWorker.id == worker_id).first()
        if not worker:
            return False
        worker.status = status
        session.commit()
        return True


def get_palette_by_id(
    palette_id: uuid.UUID, app_user_id: uuid.UUID | None = None
) -> Palette | None:
    with Session(db_engine) as session:
        result = (
            session.query(Palette, func.count(PaletteFavorite.palette_id).label("favorites_count"))
            .outerjoin(PaletteFavorite, Palette.id == PaletteFavorite.palette_id)
            .options(joinedload(Palette.colors))
            .filter(Palette.id == palette_id)
            .group_by(Palette.id)
            .first()
        )
        if result is None:
            return None
        palette, favorites_count = result
        palette.favorites_count = favorites_count
        palette.has_user_favorited = palette.check_has_user_favorited(app_user_id, session)
        return palette
