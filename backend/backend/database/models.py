import uuid
from datetime import datetime
from typing import List

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, RelationshipProperty, mapped_column, relationship

from .engine import Base
from .types import Cube


class AlphaSignup(Base):
    __tablename__ = "alpha_signups"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String, unique=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(primary_key=True, default=lambda: str(uuid.uuid4()))
    auth_id: Mapped[str] = mapped_column(String, unique=True)
    email: Mapped[str] = mapped_column(String, unique=True)
    display_name: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)


class PaletteColor(Base):
    __tablename__ = "palette_colors"

    id: Mapped[str] = mapped_column(primary_key=True, default=lambda: str(uuid.uuid4()))
    palette_id: Mapped[str] = mapped_column(ForeignKey("palettes.id"))
    hex: Mapped[str] = mapped_column(String)
    r: Mapped[int] = mapped_column(Integer)
    g: Mapped[int] = mapped_column(Integer)
    b: Mapped[int] = mapped_column(Integer)
    rgb_cube: Mapped[str] = mapped_column(Cube)

    palette: Mapped["Palette"] = relationship("Palette", back_populates="colors")


# Can use cube to do color similarity search
# -- All palette_colors within ~50 Euclidean distance of #FFBBCC
# SELECT *
# FROM palette_colors
# WHERE cube(array[255, 187, 204]) <-> rgb_cube < 50;


class Palette(Base):
    __tablename__ = "palettes"

    id: Mapped[str] = mapped_column(primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(String, ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    name: Mapped[str] = mapped_column(String)
    image_url: Mapped[str] = mapped_column(String)

    colors: Mapped[List["PaletteColor"]] = relationship(
        "PaletteColor", back_populates="palette"
    )
