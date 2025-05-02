from datetime import datetime
from typing import Any, Dict, List, Tuple
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
                id=color.id,
                hex=color.hex,
                r=color.r,
                g=color.g,
                b=color.b,
            )
            for color in palette.colors
        ],
        moderationStatus=palette.moderation_status,
    )


def map_palette_array_to_response(palettes: List[Palette]) -> List[PaletteResponse]:
    return [map_palette_to_response(palette) for palette in palettes]


class GeneratePaletteResponse(BaseModel):
    color: str
    percentLocation: Tuple[int, int]


def map_generate_palette_to_response(
    color: str,
    percent_location: Tuple[float, float],
) -> GeneratePaletteResponse:
    return GeneratePaletteResponse(
        color=color,
        percentLocation=(round(percent_location[0]), round(percent_location[1])),
    )


def map_generate_palette_array_to_response(
    palette_data: List[Dict[str, Any]],
) -> List[GeneratePaletteResponse]:
    return [
        map_generate_palette_to_response(item["color"], item["percent_location"])
        for item in palette_data
    ]
