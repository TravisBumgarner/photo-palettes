from fastapi import Query

from database.models import ModerationStatus
from database.queries.palettes import get_palettes, get_palettes_count
from middleware.auth import RequestWithAuthState
from services.logger import log_error
from utils.auth import user_is_moderator

from . import palettes_router
from .palette_response_models import map_palette_array_to_response


def validate_request(request: RequestWithAuthState):
    if not (user_is_moderator(request)):
        return {
            "success": False,
            "error": "User is not a moderator",
        }

    return None


@palettes_router.get("/moderator")
def get_list_as_moderator(
    request: RequestWithAuthState,
    status: ModerationStatus,
    size: int = Query(25, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    validation_error = validate_request(request)
    if validation_error:
        return validation_error

    try:
        palettes = get_palettes(moderation_status=status, size=size, offset=offset)
        total_count = get_palettes_count(moderation_status=status)

        return {
            "success": True,
            "palettes": map_palette_array_to_response(palettes),
            "total": total_count,
        }
    except Exception as e:
        log_error(e, "get_palette_list_as_moderator")
        return {
            "success": False,
            "error": "Failed to get palettes",
        }
