from fastapi import Query

from database.models import ModerationStatus
from database.queries.palettes import get_palettes, get_palettes_count
from middleware.auth import RequestWithAuthState
from services.logger import log_error

from . import palettes_router
from .palette_response_models import map_palette_array_to_response


@palettes_router.get("")
async def get_list_moderated(
    request: RequestWithAuthState, size: int = Query(25, ge=1, le=100), offset: int = Query(0, ge=0)
):
    try:
        palettes = get_palettes(
            moderation_status=ModerationStatus.APPROVED, size=size, offset=offset
        )
        total_count = get_palettes_count(moderation_status=ModerationStatus.APPROVED)

        return {
            "success": True,
            "palettes": map_palette_array_to_response(palettes),
            "total": total_count,
        }

    except Exception as error:
        log_error(error, "get_palette_list_moderated")
        return {
            "success": False,
            "error": "Failed to get moderated palettes",
        }
