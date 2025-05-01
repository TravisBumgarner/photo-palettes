from database.queries.palettes import get_moderated_palettes
from middleware.auth import RequestWithAuthState
from services.logger import log_error

from . import palettes_router
from .palette_response_models import map_palette_array_to_response


@palettes_router.get("/")
async def get_list_moderated(request: RequestWithAuthState):
    try:
        palettes = get_moderated_palettes()

        return {
            "success": True,
            "palettes": map_palette_array_to_response(palettes),
        }

    except Exception as error:
        log_error(error)
        return {
            "success": False,
            "error": "Failed to get moderated palettes",
        }
