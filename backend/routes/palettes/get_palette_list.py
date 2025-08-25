import uuid

from fastapi import Query

from database.models import ModerationStatus
from database.queries.palettes import get_palettes, get_palettes_count
from database.queries.users import get_app_user_by_app_user_id
from middleware.auth import RequestWithAuthState
from services.logger import log_error

from . import palettes_router
from .palette_response_models import map_palette_array_to_response


@palettes_router.get("")
async def get_palette_list(
    request: RequestWithAuthState,
    size: int = Query(25, ge=1, le=100),
    offset: int = Query(0, ge=0),
    moderation_status: ModerationStatus = ModerationStatus.APPROVED,
    app_user_id: uuid.UUID | None = None,
):
    try:
        limit_to_approved = True

        if app_user_id:
            user_exists = get_app_user_by_app_user_id(app_user_id)
            if not user_exists:
                return {
                    "success": False,
                    "error": "User does not exist",
                }

            # If user is not logged in, they are viewing another user's palettes.
            if not getattr(request.state, "app_user_id", None):
                limit_to_approved = True
            else:
                limit_to_approved = request.state.app_user_id != app_user_id

        # Can't view other user's unapproved palettes
        moderation_status = ModerationStatus.APPROVED if limit_to_approved else moderation_status

        palettes = get_palettes(
            size=size,
            offset=offset,
            moderation_status=moderation_status,
            app_user_id=app_user_id,
        )

        total_count = get_palettes_count(
            moderation_status=moderation_status, app_user_id=app_user_id
        )
        return {
            "success": True,
            "palettes": map_palette_array_to_response(palettes),
            "total": total_count,
        }

    except Exception as error:
        log_error(error, "get_palette_list")

        return {
            "success": False,
            "error": "Failed to get palettes",
        }
