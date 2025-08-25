from datetime import datetime
from typing import List, Tuple, TypedDict
from uuid import UUID

from pydantic import BaseModel

from database.models import Palette
from utils.photos import get_photo_path


class PaletteColorResponse(BaseModel):
    id: UUID
    hex: str
    r: int
    g: int
    b: int


class PaletteResponse(BaseModel):
    id: UUID
    name: str
    createdAt: datetime
    photoUrl: str
    colors: List[PaletteColorResponse]
    moderationStatus: int
    appUserId: UUID
    ogPhotoUrl: str
    blurhash: str
    aspectRatio: float
    favoritesCount: int
    # hasUserFavorited: bool


def map_palette_to_response(palette: Palette, favorites_count: int) -> PaletteResponse:
    return PaletteResponse(
        id=palette.id,
        name=palette.name,
        createdAt=palette.created_at,
        appUserId=palette.app_user_id,
        photoUrl=get_photo_path(palette.photo_details),
        ogPhotoUrl=get_photo_path(palette.og_photo_details),
        colors=[
            PaletteColorResponse(
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
        favoritesCount=favorites_count,
        # hasUserFavorited=palette.has_user_favorited,
    )


def map_palette_array_to_response(palettes: List[Palette]) -> List[PaletteResponse]:
    return [map_palette_to_response(palette[0], palette[1]) for palette in palettes]


class GeneratePaletteResponse(BaseModel):
    color: str
    percentLocation: Tuple[float, float]


def map_generate_palette_to_response(
    color: str,
    percent_location: list[float],
) -> GeneratePaletteResponse:
    return GeneratePaletteResponse(
        color=color,
        percentLocation=(round(percent_location[0]), round(percent_location[1])),
    )


class PaletteData(TypedDict):
    color: str
    percent_location: list[float]


def map_generate_palette_array_to_response(
    palette_data: List[PaletteData],
) -> List[GeneratePaletteResponse]:
    return [
        map_generate_palette_to_response(item["color"], item["percent_location"])
        for item in palette_data
    ]
