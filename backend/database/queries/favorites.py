import uuid

from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from database.engine import db_engine
from database.models import ModerationStatus, Palette, PaletteFavorite, SortBy
from database.queries.shared import ORDER_BY


def add_palette_to_favorites(
    app_user_id: uuid.UUID, palette_id: uuid.UUID
) -> PaletteFavorite | None:
    with Session(db_engine) as session:
        favorite = PaletteFavorite(app_user_id=app_user_id, palette_id=palette_id)
        session.add(favorite)
        session.commit()
        session.refresh(favorite)
        return favorite


def remove_palette_from_favorites(app_user_id: uuid.UUID, palette_id: uuid.UUID) -> bool:
    with Session(db_engine) as session:
        favorite = (
            session.query(PaletteFavorite)
            .filter(
                PaletteFavorite.app_user_id == app_user_id, PaletteFavorite.palette_id == palette_id
            )
            .first()
        )
        if not favorite:
            return False
        session.delete(favorite)
        session.commit()
        return True


def get_app_user_favorites(
    size: int,
    offset: int,
    app_user_id: uuid.UUID,
    sort_by: SortBy = SortBy.NEWEST,
) -> list[Palette]:
    with Session(db_engine) as session:
        query = (
            session.query(
                Palette,
                func.count(PaletteFavorite.palette_id).label("favorites_count"),
            )
            .outerjoin(PaletteFavorite, Palette.id == PaletteFavorite.palette_id)
            .options(joinedload(Palette.colors))
            .filter(Palette.moderation_status == ModerationStatus.APPROVED)
            .filter(PaletteFavorite.app_user_id == app_user_id)
            .group_by(Palette.id)
            .order_by(ORDER_BY.get(sort_by, Palette.created_at.asc()))
            .offset(offset)
            .limit(size)
        )

        results = query.all()  # (Palette, favorites_count)

        palettes: list[Palette] = []
        for palette, favorites_count in results:
            palette.favorites_count = favorites_count
            palette.has_user_favorited = True
            palettes.append(palette)

        return palettes


def get_favorites_count(app_user_id: uuid.UUID) -> int:
    with Session(db_engine) as session:
        return (
            session.query(PaletteFavorite)
            .filter(PaletteFavorite.app_user_id == app_user_id)
            .count()
        )
