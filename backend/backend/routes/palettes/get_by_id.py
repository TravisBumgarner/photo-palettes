from uuid import UUID

from backend.database.queries.palettes import get_palette_by_id
from backend.middleware.auth import RequestWithAuthState

from . import palettes_router
from .response_models import PaletteColorResponse, PaletteResponse


@palettes_router.get("/id/{palette_id}")
async def get_by_id(request: RequestWithAuthState, palette_id: str):
    palette = get_palette_by_id(UUID(palette_id))

    if not palette:
        return {
            "success": False,
            "error": "Palette not found",
        }

    return {
        "success": True,
        "palette": PaletteResponse(
            id=palette.id,
            name=palette.name,
            created_at=palette.created_at,
            photo_url=palette.photo_url,
            colors=[
                PaletteColorResponse(id=color.id, hex=color.hex, r=color.r, g=color.g, b=color.b)
                for color in palette.colors
            ],
            moderation_status=palette.moderation_status,
        ),
    }
