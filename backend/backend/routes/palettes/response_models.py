from datetime import datetime
from typing import List
from uuid import UUID

from pydantic import BaseModel


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
