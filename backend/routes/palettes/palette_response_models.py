from datetime import datetime
from uuid import UUID

from common.models import Palette
from common.utils.photos import get_photo_path
from pydantic import BaseModel


class PaletteColorResponse(BaseModel):
    id: UUID
    hex: str
    percentLocation: list[float]  # noqa #815
    r: int
    g: int
    b: int
    name: str


class PaletteResponse(BaseModel):
    id: UUID
    name: str
    createdAt: datetime  # noqa #815
    photoUrl: str  # noqa #815
    colors: list[PaletteColorResponse]
    moderationStatus: int  # noqa #815
    appUserId: UUID  # noqa #815
    ogPhotoUrl: str  # noqa #815
    blurhash: str
    aspectRatio: float  # noqa #815
    favoritesCount: int  # noqa #815
    hasUserFavorited: bool  # noqa #815


def map_palette_to_response(palette: Palette) -> PaletteResponse:
    return PaletteResponse(
        id=palette.id,
        name=palette.name,
        createdAt=palette.created_at,
        appUserId=palette.app_user_id,
        photoUrl=get_photo_path(palette.photo_details),
        ogPhotoUrl=get_photo_path(palette.og_photo_details),
        colors=[
            PaletteColorResponse(
                percentLocation=color.percent_location,
                id=color.id,
                hex=color.hex,
                r=color.r,
                g=color.g,
                b=color.b,
                name=color.name,
            )
            for color in palette.colors
        ],
        moderationStatus=palette.moderation_status,
        blurhash=palette.blurhash,
        aspectRatio=palette.aspect_ratio,
        favoritesCount=palette.favorites_count,
        hasUserFavorited=palette.has_user_favorited,
    )


def map_palette_array_to_response(palettes: list[Palette]) -> list[PaletteResponse]:
    return [map_palette_to_response(palette) for palette in palettes]
