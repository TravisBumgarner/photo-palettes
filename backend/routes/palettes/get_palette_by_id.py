from uuid import UUID

from database.queries.palettes import get_palette_by_id
from middleware.auth import RequestWithAuthState
from services.logger import log_error

from . import palettes_router
from .palette_response_models import map_palette_to_response


@palettes_router.get("/id")
async def get_by_id(request: RequestWithAuthState, id: str):
    try:
        palette = get_palette_by_id(UUID(id))

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
