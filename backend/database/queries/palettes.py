import uuid
from typing import Optional

from database.engine import db_engine
from database.models import ModerationStatus, Palette, PaletteFavorite, SortBy
from database.queries.shared import ORDER_BY
from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload


def get_palettes_count(
    moderation_status: ModerationStatus,
    author_user_id: uuid.UUID | None = None,
) -> int:
    with Session(db_engine) as session:
        query = session.query(Palette).filter(
            Palette.moderation_status == moderation_status
        )

        if author_user_id:
            query = query.filter(Palette.app_user_id == author_user_id)

        return query.count()


def get_palettes(
    moderation_status: ModerationStatus = ModerationStatus.APPROVED,
    size: int | None = None,
    offset: int | None = None,
    author_user_id: uuid.UUID | None = None,
    sort_by: SortBy = SortBy.NEWEST,
    app_user_id: uuid.UUID | None = None,
) -> list[Palette]:
    with Session(db_engine) as session:
        query = (
            session.query(
                Palette,
                func.count(PaletteFavorite.palette_id).label("favorites_count"),
            )
            .outerjoin(PaletteFavorite, Palette.id == PaletteFavorite.palette_id)
            .options(joinedload(Palette.colors))
            .filter(Palette.moderation_status == moderation_status)
            .group_by(Palette.id)
            .order_by(ORDER_BY.get(sort_by, Palette.created_at.asc()))
        )

        if author_user_id:
            query = query.filter(Palette.app_user_id == author_user_id)

        query = query.offset(offset)
        query = query.limit(size)

        results = query.all()  # (Palette, favorites_count)

        palettes: list[Palette] = []
        for palette, favorites_count in results:
            palette.favorites_count = favorites_count
            palette.has_user_favorited = palette.check_has_user_favorited(
                app_user_id, session
            )
            palettes.append(palette)

        return palettes


def get_palette_by_id(
    palette_id: uuid.UUID, app_user_id: uuid.UUID | None = None
) -> Palette | None:
    with Session(db_engine) as session:
        result = (
            session.query(
                Palette, func.count(PaletteFavorite.palette_id).label("favorites_count")
            )
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
        palette.has_user_favorited = palette.check_has_user_favorited(
            app_user_id, session
        )
        return palette


def create_palette(palette: Palette):
    with Session(db_engine) as session:
        session.add(palette)
        session.commit()
        session.refresh(palette)
        return palette


# Could use a better home.
class PaletteUpdate(BaseModel):
    moderation_status: Optional[ModerationStatus] = None
    og_photo_details: Optional[str] = None


def update_palette(palette_id: uuid.UUID, update: PaletteUpdate):
    with Session(db_engine) as session:
        palette = session.query(Palette).filter(Palette.id == palette_id).first()
        if not palette:
            return None

        for field, value in update.model_dump(exclude_unset=True).items():
            setattr(palette, field, value)

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
