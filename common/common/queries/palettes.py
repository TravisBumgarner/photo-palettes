import uuid

from pydantic import BaseModel
from sqlalchemy.orm import Session

from common.models import ModerationStatus, Palette

# Could use a better home.


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
