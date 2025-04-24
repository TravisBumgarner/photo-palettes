import uuid
from datetime import datetime
from enum import IntEnum
from typing import List

from sqlalchemy import UUID, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .engine import Base
from .types import Cube


class PermissionLevel(IntEnum):
    MEMBER = 0
    MODERATOR = 2
    ADMIN = 5


class AlphaSignup(Base):
    __tablename__ = "alpha_signups"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String, unique=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)


class AppUser(Base):
    __tablename__ = "app_users"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    auth_id: Mapped[uuid.UUID] = mapped_column(UUID, unique=True)
    email: Mapped[str] = mapped_column(String, unique=True)
    display_name: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    palettes: Mapped[List["Palette"]] = relationship("Palette", back_populates="user")
    permission_level: Mapped[PermissionLevel] = mapped_column(
        Integer, default=PermissionLevel.MEMBER
    )


class PaletteColor(Base):
    __tablename__ = "palette_colors"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    palette_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("palettes.id"))
    hex: Mapped[str] = mapped_column(String)
    r: Mapped[int] = mapped_column(Integer)
    g: Mapped[int] = mapped_column(Integer)
    b: Mapped[int] = mapped_column(Integer)
    # Can use cube to do color similarity search
    rgb_cube: Mapped[str] = mapped_column(Cube)

    palette: Mapped["Palette"] = relationship("Palette", back_populates="colors")


class ModerationStatus(IntEnum):
    AWAITING_SUBMISSION = -1
    AWAITING_MODERATION = 0
    APPROVED = 1
    REJECTED = 2


class Palette(Base):
    __tablename__ = "palettes"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    app_user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("app_users.id"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    name: Mapped[str] = mapped_column(String)
    image_url: Mapped[str] = mapped_column(String)

    colors: Mapped[List["PaletteColor"]] = relationship("PaletteColor", back_populates="palette")
    user: Mapped["AppUser"] = relationship("AppUser", back_populates="palettes")
    moderation_status: Mapped[ModerationStatus] = mapped_column(
        Integer, default=ModerationStatus.AWAITING_SUBMISSION
    )
