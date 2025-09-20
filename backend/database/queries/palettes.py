import uuid

from common.models import ModerationStatus, Palette, PaletteFavorite, SortBy
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from database.engine import db_engine
from database.queries.shared import ORDER_BY


def get_palettes_count(
    moderation_status: ModerationStatus,
    author_user_id: uuid.UUID | None = None,
) -> int:
    with Session(db_engine) as session:
        query = session.query(Palette).filter(Palette.moderation_status == moderation_status)

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
            palette.has_user_favorited = palette.check_has_user_favorited(app_user_id, session)
            palettes.append(palette)

        return palettes


def create_palette(palette: Palette):
    with Session(db_engine) as session:
        session.add(palette)
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
