import uuid
from datetime import datetime
from enum import Enum, IntEnum

from sqlalchemy import (
    ARRAY,
    JSON,
    UUID,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    exists,
    select,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.types import UserDefinedType


class Cube(UserDefinedType):
    def get_col_spec(self, **kw):
        return "CUBE"


class Base(DeclarativeBase):
    pass


class PermissionLevel(IntEnum):
    Anonymous = -1
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
    auth_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), unique=True)
    email: Mapped[str] = mapped_column(String, unique=True)
    display_name: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    palettes: Mapped[list["Palette"]] = relationship("Palette", back_populates="user")
    permission_level: Mapped[PermissionLevel] = mapped_column(
        Integer, default=PermissionLevel.MEMBER
    )
    favorites = relationship("PaletteFavorite", back_populates="user")


class PaletteColor(Base):
    __tablename__ = "palette_colors"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    palette_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("palettes.id", ondelete="CASCADE"))
    hex: Mapped[str] = mapped_column(String)
    r: Mapped[int] = mapped_column(Integer)
    g: Mapped[int] = mapped_column(Integer)
    b: Mapped[int] = mapped_column(Integer)
    percent_location: Mapped[list[float]] = mapped_column(
        ARRAY(Float, dimensions=1), default=[0.0, 0.0]
    )
    # Can use cube to do color similarity search
    rgb_cube: Mapped[str] = mapped_column(Cube)

    palette: Mapped["Palette"] = relationship("Palette", back_populates="colors")


class ModerationStatus(IntEnum):
    AWAITING_MODERATION = 0
    APPROVED = 1
    REJECTED = 2


class SortBy(Enum):
    NEWEST = "newest"
    FAVORITES_COUNT = "favorites_count"
    OLDEST = "oldest"


class Palette(Base):
    __tablename__ = "palettes"
    favorites_count: int = 0  # Not a DB column, used for runtime annotation
    has_user_favorited: bool = False  # Not a DB column, used for runtime annotation

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    app_user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("app_users.id", ondelete="CASCADE"))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    name: Mapped[str] = mapped_column(String(50))
    photo_details: Mapped[str] = mapped_column(String)
    og_photo_details: Mapped[str] = mapped_column(String)
    colors: Mapped[list["PaletteColor"]] = relationship(
        "PaletteColor", back_populates="palette", cascade="all, delete-orphan"
    )
    user: Mapped["AppUser"] = relationship("AppUser", back_populates="palettes")
    moderation_status: Mapped[ModerationStatus] = mapped_column(
        Integer, default=ModerationStatus.AWAITING_MODERATION
    )
    blurhash: Mapped[str] = mapped_column(String)
    aspect_ratio: Mapped[float] = mapped_column(Float)
    favorites: Mapped[list["PaletteFavorite"]] = relationship(
        "PaletteFavorite", back_populates="palette", cascade="all, delete-orphan"
    )

    def check_has_user_favorited(self, user_id: uuid.UUID, session) -> bool:
        return session.execute(
            select(
                exists().where(
                    PaletteFavorite.palette_id == self.id,
                    PaletteFavorite.app_user_id == user_id,
                )
            )
        ).scalar_one()


class PaletteFavorite(Base):
    __tablename__ = "palette_favorites"

    app_user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("app_users.id", ondelete="CASCADE"), primary_key=True
    )
    palette_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("palettes.id", ondelete="CASCADE"), primary_key=True
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)

    user: Mapped["AppUser"] = relationship("AppUser", back_populates="favorites")
    palette: Mapped["Palette"] = relationship("Palette", back_populates="favorites")


class FeatureRequestStatus(IntEnum):
    PENDING = 0
    APPROVED = 1
    REJECTED = 2


class FeatureRequestVote(Base):
    __tablename__ = "feature_request_votes"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    request_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("feature_requests.id", ondelete="CASCADE")
    )
    app_user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("app_users.id", ondelete="CASCADE"))

    request: Mapped["FeatureRequest"] = relationship("FeatureRequest", back_populates="votes")


class FeatureRequest(Base):
    __tablename__ = "feature_requests"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    title: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(String)
    status: Mapped[FeatureRequestStatus] = mapped_column(
        Integer, default=FeatureRequestStatus.PENDING
    )
    votes: Mapped[list["FeatureRequestVote"]] = relationship(
        "FeatureRequestVote", back_populates="request"
    )


class ServiceSession(Base):
    __tablename__ = "service_sessions"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    service: Mapped[str] = mapped_column(String, unique=True)  # e.g. "instagram"
    session_json: Mapped[dict] = mapped_column(JSON)


class ImageImageWorkerStatusEnum(str, Enum):
    GENERATE_OG = "generate_og"


class ImageWorkerStatusEnum(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"


class ImageWorker(Base):
    __tablename__ = "worker_actions"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    palette_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("palettes.id", ondelete="SET NULL"), nullable=True
    )
    action_type: Mapped[ImageWorkerStatusEnum] = mapped_column(String)
    status: Mapped[ImageWorkerStatusEnum] = mapped_column(
        String, default=ImageWorkerStatusEnum.PENDING
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.now)
    processed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
