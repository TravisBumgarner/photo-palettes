from datetime import datetime
from typing import TypedDict
from uuid import UUID

from pydantic import BaseModel

from database.models import Palette
from utils.photos import get_photo_path


class PaletteColorResponse(BaseModel):
    id: UUID
    hex: str
    percentLocation: list[float]  # noqa #815
    r: int
    g: int
    b: int


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


class GeneratePaletteResponse(BaseModel):
    color: str
    percentLocation: tuple[float, float]  # noqa #815


def map_generate_palette_to_response(
    color: str,
    percent_location: list[float],
) -> GeneratePaletteResponse:
    return GeneratePaletteResponse(
        color=color,
        percentLocation=(percent_location[0], percent_location[1]),
    )


class PaletteData(TypedDict):
    color: str
    percent_location: list[float]


def map_generate_palette_array_to_response(
    palette_data: list[PaletteData],
) -> list[GeneratePaletteResponse]:
    return [
        map_generate_palette_to_response(item["color"], item["percent_location"])
        for item in palette_data
    ]
