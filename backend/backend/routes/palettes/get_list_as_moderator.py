from backend.database.models import ModerationStatus
from backend.database.queries.palettes import get_palettes_by_moderation_status
from backend.middleware.auth import RequestWithAuthState
from backend.utils.auth import user_is_moderator

from . import palettes_router
from .response_models import map_palette_array_to_response


def validate_request(request: RequestWithAuthState):
    if not (user_is_moderator(request)):
        return {
            "success": False,
            "error": "User is not a moderator",
        }

    return None


@palettes_router.get("/moderator/{status}")
def get_list_as_moderator(request: RequestWithAuthState, status: ModerationStatus):
    validation_error = validate_request(request)
    if validation_error:
        return validation_error

    palettes = get_palettes_by_moderation_status(status)

    return {
        "success": True,
        "palettes": map_palette_array_to_response(palettes),
    }
