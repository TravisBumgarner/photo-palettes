import uuid
from typing import List, Optional

from sqlalchemy.orm import Session, joinedload

from database.engine import db_engine
from database.models import ModerationStatus, Palette


def get_palettes_count(
    moderation_status: ModerationStatus, app_user_id: Optional[uuid.UUID] = None
) -> int:
    with Session(db_engine) as session:
        query = session.query(Palette)
        query = query.filter(Palette.moderation_status == moderation_status)
        if app_user_id is not None:
            query = query.filter(Palette.app_user_id == app_user_id)
        return query.count()


def get_palettes(
    moderation_status: ModerationStatus | None = ModerationStatus.APPROVED,
    size: int | None = None,
    offset: int | None = None,
    app_user_id: Optional[uuid.UUID] = None,
) -> List[Palette]:
    with Session(db_engine) as session:
        query = session.query(Palette).options(joinedload(Palette.colors))
        query = query.filter(Palette.moderation_status == moderation_status)
        if app_user_id is not None:
            query = query.filter(Palette.app_user_id == app_user_id)
        query = query.order_by(Palette.created_at.asc())
        if offset is not None:
            query = query.offset(offset)
        if size is not None:
            query = query.limit(size)
        return query.all()


def get_palette_by_id(palette_id: uuid.UUID) -> Palette | None:
    with Session(db_engine) as session:
        return (
            session.query(Palette)
            .options(joinedload(Palette.colors))
            .filter(Palette.id == palette_id)
            .first()
        )


def update_palette_moderation_status(palette_id: uuid.UUID, moderation_status: ModerationStatus):
    with Session(db_engine) as session:
        palette = session.query(Palette).filter(Palette.id == palette_id).first()
        if not palette:
            return None
        palette.moderation_status = moderation_status
        session.commit()
        session.refresh(palette)
        return palette


def create_palette(palette: Palette):
    with Session(db_engine) as session:
        session.add(palette)
        session.commit()
        session.refresh(palette)
        return palette


def update_palette(palette_id: uuid.UUID, **kwargs):
    with Session(db_engine) as session:
        palette = session.query(Palette).filter(Palette.id == palette_id).first()
        if not palette:
            return None

        # Handle colors separately if present
        if "colors" in kwargs:
            colors = kwargs.pop("colors")
            for color in colors:
                session.add(color)

        # Handle other attributes
        for key, value in kwargs.items():
            setattr(palette, key, value)

        session.commit()
        session.refresh(palette)
        return palette


def delete_palette_by_id(palette_id: uuid.UUID) -> bool:
    with Session(db_engine) as session:
        palette = session.query(Palette).filter(Palette.id == palette_id).first()
        if not palette:
            return False
        session.delete(palette)
        session.commit()
        return True
