from backend.database.queries.palettes import get_moderated_palettes
from backend.middleware.auth import RequestWithAuthState
from backend.utils.logger import log_error

from . import palettes_router


@palettes_router.get("/")
async def get_list_moderated(request: RequestWithAuthState):
    try:
        palettes = get_moderated_palettes()
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
