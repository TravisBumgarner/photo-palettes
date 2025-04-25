from uuid import UUID

from backend.database.queries.palettes import get_palette_by_id
from backend.middleware.auth import RequestWithAuthState
from backend.utils.photos import get_photo_path

from . import palettes_router


@palettes_router.get("/id/{palette_id}")
async def get_by_id(request: RequestWithAuthState, palette_id: str):
    palette = get_palette_by_id(UUID(palette_id))

    if not palette:
        return {
            "success": False,
            "error": "Palette not found",
        }

    palette.photo_details = get_photo_path(palette.photo_details)
    return {
        "success": True,
        "palette": palette,
    }
