from uuid import UUID

from backend.database.queries.palettes import get_palette_by_id
from backend.middleware.auth import RequestWithAuthState
from backend.services.logger import log_error

from . import palettes_router
from .palette_response_models import map_palette_to_response


@palettes_router.get("/id/{palette_id}")
async def get_by_id(request: RequestWithAuthState, palette_id: str):
    try:
        palette = get_palette_by_id(UUID(palette_id))

        if not palette:
            return {
                "success": False,
                "error": "Palette not found",
            }

        return {
            "success": True,
            "palette": map_palette_to_response(palette),
        }
    except Exception as e:
        log_error(e)
        return {
            "success": False,
            "error": "Failed to get palette",
        }
