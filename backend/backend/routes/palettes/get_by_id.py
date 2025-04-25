from uuid import UUID

from fastapi import HTTPException

from backend.database.queries.palettes import get_palette_by_id
from backend.middleware.auth import RequestWithAuthState

from . import palettes_router


@palettes_router.get("/{palette_id}")
async def get_palette(request: RequestWithAuthState, palette_id: str):
    palette = get_palette_by_id(UUID(palette_id))
    if not palette:
        raise HTTPException(status_code=404, detail="Palette not found")
    return palette
