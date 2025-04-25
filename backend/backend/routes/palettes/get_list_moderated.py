from backend.database.queries.palettes import get_moderated_palettes
from backend.middleware.auth import RequestWithAuthState
from backend.services.logger import log_error
from backend.utils.photos import get_photo_path

from . import palettes_router


@palettes_router.get("/")
async def get_list_moderated(request: RequestWithAuthState):
    try:
        palettes = get_moderated_palettes()
        for palette in palettes:
            palette.photo_details = get_photo_path(palette.photo_details)
    except Exception as error:
        log_error(error)
        return {
            "success": False,
            "error": "Failed to get moderated palettes",
        }

    return {
        "success": True,
        "palettes": palettes,
    }
