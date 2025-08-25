import uuid

from sqlalchemy.orm import Session

from database.engine import db_engine
from database.models import PaletteFavorite


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
