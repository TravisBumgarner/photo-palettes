import uuid

from pydantic import BaseModel
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from common.models import ModerationStatus, Palette, PaletteFavorite

# Could use a better home.


def get_palette_by_id(
    db_engine, palette_id: uuid.UUID, app_user_id: uuid.UUID | None = None
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


class PaletteUpdate(BaseModel):
    moderation_status: ModerationStatus | None = None
    og_photo_details: str | None = None


def update_palette(db_engine, palette_id: uuid.UUID, update: PaletteUpdate):
    with Session(db_engine) as session:
        palette = session.query(Palette).filter(Palette.id == palette_id).first()
        if not palette:
            return None

        for field, value in update.model_dump(exclude_unset=True).items():
            setattr(palette, field, value)

        session.commit()
        session.refresh(palette)
        return palette
