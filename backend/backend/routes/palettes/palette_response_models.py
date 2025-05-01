from datetime import datetime
from typing import List
from uuid import UUID

from pydantic import BaseModel

from backend.database.models import Palette


class PaletteColorResponse(BaseModel):
    id: UUID
    hex: str
    r: int
    g: int
    b: int


class PaletteResponse(BaseModel):
    id: UUID
    name: str
    created_at: datetime
    photo_url: str
    colors: List[PaletteColorResponse]
    moderation_status: int


def map_palette_to_response(palette: Palette) -> PaletteResponse:
    return PaletteResponse(
        id=palette.id,
        name=palette.name,
        created_at=palette.created_at,
        photo_url=palette.photo_url,
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
        moderation_status=palette.moderation_status,
    )


def map_palette_array_to_response(palettes: List[Palette]) -> List[PaletteResponse]:
    return [map_palette_to_response(palette) for palette in palettes]
