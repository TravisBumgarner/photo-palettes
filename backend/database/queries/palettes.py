import uuid
from typing import List

from sqlalchemy.orm import joinedload

from database.engine import SessionLocal
from database.models import ModerationStatus, Palette


def get_moderated_palettes() -> List[Palette]:
    session = SessionLocal()
    return (
        session.query(Palette)
        .options(joinedload(Palette.colors))
        .filter(Palette.moderation_status == ModerationStatus.APPROVED)
        .all()
    )


def get_palettes_by_moderation_status(moderation_status: ModerationStatus) -> List[Palette]:
    session = SessionLocal()
    return (
        session.query(Palette)
        .options(joinedload(Palette.colors))
        .filter(Palette.moderation_status == moderation_status)
        .all()
    )


def get_palette_by_id(palette_id: uuid.UUID) -> Palette | None:
    session = SessionLocal()
    return (
        session.query(Palette)
        .options(joinedload(Palette.colors))
        .filter(Palette.id == palette_id)
        .first()
    )


def update_palette_moderation_status(palette_id: uuid.UUID, moderation_status: ModerationStatus):
    session = SessionLocal()
    palette = session.query(Palette).filter(Palette.id == palette_id).first()
    if not palette:
        raise ValueError("Palette not found")
    palette.moderation_status = moderation_status
    session.commit()
    session.refresh(palette)
    return palette


def create_palette(palette: Palette):
    session = SessionLocal()
    session.add(palette)
    session.commit()
    session.refresh(palette)
    return palette


def update_palette(palette_id: uuid.UUID, **kwargs):
    session = SessionLocal()
    palette = session.query(Palette).filter(Palette.id == palette_id).first()
    if not palette:
        raise ValueError("Palette not found")

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


def get_palettes_by_app_user_id(
    app_user_id: uuid.UUID,
    status: ModerationStatus = ModerationStatus.APPROVED,
) -> List[Palette]:
    session = SessionLocal()

    return (
        session.query(Palette)
        .options(joinedload(Palette.colors))
        .filter(Palette.app_user_id == app_user_id)
        .filter(Palette.moderation_status == status)
        .all()
    )
