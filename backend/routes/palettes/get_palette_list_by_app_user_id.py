from uuid import UUID

from database.models import ModerationStatus
from database.queries.palettes import get_palettes_by_app_user_id
from middleware.auth import RequestWithAuthState
from services.logger import log_error

from . import palettes_router
from .palette_response_models import map_palette_array_to_response


@palettes_router.get("/app_user_id/{app_user_id}")
async def get_by_app_user_id(
    request: RequestWithAuthState, app_user_id: str, status: ModerationStatus
):
    try:
        # If user is not logged in, they are viewing another user's palettes.
        if not getattr(request.state, "app_user_id", None):
            is_viewing_other_user = True
        else:
            is_viewing_other_user = request.state.app_user_id != UUID(app_user_id)

        # If the user is viewing another user's palettes, only show approved palettes.
        if is_viewing_other_user:
            palettes = get_palettes_by_app_user_id(
                app_user_id=UUID(app_user_id),
                status=ModerationStatus.APPROVED,
            )
        else:
            palettes = get_palettes_by_app_user_id(
                app_user_id=UUID(app_user_id),
                status=status,
            )

        return {
            "success": True,
            "palettes": map_palette_array_to_response(palettes),
        }

    except Exception as e:
        log_error(e, "get_palette_list_by_app_user_id")
        return {
            "success": False,
            "error": "Failed to get palette",
        }
