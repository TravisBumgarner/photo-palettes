from backend.database.queries.palettes import get_unmoderated_palettes
from backend.middleware.auth import RequestWithAuthState
from backend.utils.auth import user_is_moderator

from . import palettes_router


def validate_request(request: RequestWithAuthState):
    if not (user_is_moderator(request)):
        return {
            "success": False,
            "error": "User is not a moderator",
        }

    return None


@palettes_router.get("/unmoderated")
def get_list_unmoderated(request: RequestWithAuthState):
    validation_error = validate_request(request)
    if validation_error:
        return validation_error

    palettes = get_unmoderated_palettes()
    return {
        "success": True,
        "palettes": palettes,
    }
