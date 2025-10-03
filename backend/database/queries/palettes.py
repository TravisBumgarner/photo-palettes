import uuid

from common.models import ModerationStatus, Palette, PaletteColor, PaletteFavorite, SortBy
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from database.engine import db_engine
from database.queries.shared import ORDER_BY


def hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    """Convert hex color to RGB tuple."""
    hex_color = hex_color.lstrip("#")
    r = int(hex_color[0:2], 16)
    g = int(hex_color[2:4], 16)
    b = int(hex_color[4:6], 16)
    return (r, g, b)


def get_palettes_count(
    moderation_status: ModerationStatus,
    author_user_id: uuid.UUID | None = None,
) -> int:
    with Session(db_engine) as session:
        query = session.query(Palette).filter(Palette.moderation_status == moderation_status)

        if author_user_id:
            query = query.filter(Palette.app_user_id == author_user_id)

        return query.count()


def update_color(color_id: uuid.UUID, name: str):
    with Session(db_engine) as session:
        color = session.query(PaletteColor).filter(PaletteColor.id == color_id).first()
        if color:
            color.name = name
            session.commit()
            session.refresh(color)
        return color


def get_colors(size: int | None = None, offset: int | None = None) -> list[PaletteColor]:
    with Session(db_engine) as session:
        query = session.query(PaletteColor)

        if offset is not None:
            query = query.offset(offset)
        if size is not None:
            query = query.limit(size)

        colors = query.all()
        return colors


def get_palettes(
    moderation_status: ModerationStatus = ModerationStatus.APPROVED,
    size: int | None = None,
    offset: int | None = None,
    author_user_id: uuid.UUID | None = None,
    sort_by: SortBy = SortBy.NEWEST,
    color: str | None = None,
    app_user_id: uuid.UUID | None = None,
) -> list[Palette]:
    print("got options", color)
    with Session(db_engine) as session:
        # Handle color-based sorting
        if sort_by == SortBy.COLOR and color:
            try:
                r_target, g_target, b_target = hex_to_rgb(color)

                # Subquery to find minimum color distance for each palette
                color_distance_subquery = (
                    session.query(
                        PaletteColor.palette_id,
                        func.min(
                            func.pow(PaletteColor.r - r_target, 2)
                            + func.pow(PaletteColor.g - g_target, 2)
                            + func.pow(PaletteColor.b - b_target, 2)
                        ).label("min_dist2"),
                    )
                    .group_by(PaletteColor.palette_id)
                    .subquery()
                )

                query = (
                    session.query(
                        Palette,
                        func.count(PaletteFavorite.palette_id).label("favorites_count"),
                        color_distance_subquery.c.min_dist2,
                    )
                    .join(
                        color_distance_subquery, Palette.id == color_distance_subquery.c.palette_id
                    )
                    .outerjoin(PaletteFavorite, Palette.id == PaletteFavorite.palette_id)
                    .options(joinedload(Palette.colors))
                    .filter(Palette.moderation_status == moderation_status)
                    .group_by(Palette.id, color_distance_subquery.c.min_dist2)
                    .order_by(color_distance_subquery.c.min_dist2.asc())
                )
            except (ValueError, AttributeError):
                # Fallback to default sorting if color parsing fails
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
        else:
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

        results = query.all()  # (Palette, favorites_count) or (Palette, favorites_count, min_dist2)

        palettes: list[Palette] = []
        for result in results:
            # Handle both regular and color-sorted results
            if sort_by == SortBy.COLOR and color:
                palette, favorites_count, _ = result  # Ignore min_dist2
            else:
                palette, favorites_count = result

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
