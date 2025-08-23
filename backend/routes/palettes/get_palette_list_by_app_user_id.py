from uuid import UUID

from fastapi import Query

from database.models import ModerationStatus
from database.queries.palettes import get_palettes, get_palettes_count
from database.queries.users import get_app_user_by_app_user_id
from middleware.auth import RequestWithAuthState
from services.logger import log_error

from . import palettes_router
from .palette_response_models import map_palette_array_to_response


@palettes_router.get("/app_user_id/{app_user_id}")
async def get_by_app_user_id(
    request: RequestWithAuthState,
    app_user_id: str,
    status: ModerationStatus,
    size: int = Query(25, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    try:
        user_exists = get_app_user_by_app_user_id(UUID(app_user_id))
        if not user_exists:
            return {
                "success": False,
                "error": "User does not exist",
            }

        # If user is not logged in, they are viewing another user's palettes.
        if not getattr(request.state, "app_user_id", None):
            is_viewing_other_user = True
        else:
            is_viewing_other_user = request.state.app_user_id != UUID(app_user_id)

        palettes = get_palettes(
            app_user_id=UUID(app_user_id),
            moderation_status=ModerationStatus.APPROVED if is_viewing_other_user else status,
            offset=offset,
            size=size,
        )

        total_count = get_palettes_count(moderation_status=status, app_user_id=UUID(app_user_id))

        return {
            "success": True,
            "palettes": map_palette_array_to_response(palettes),
            "total": total_count,
        }

    except Exception as e:
        log_error(e, "get_palette_list_by_app_user_id")
        return {
            "success": False,
            "error": "Failed to get palette",
        }
