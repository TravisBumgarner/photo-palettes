from uuid import UUID

from backend.database.queries.palettes import get_palettes_by_app_user_id
from backend.middleware.auth import RequestWithAuthState
from backend.services.logger import log_error

from . import palettes_router
from .palette_response_models import map_palette_array_to_response


@palettes_router.get("/app_user_id/{app_user_id}")
async def get_by_app_user_id(request: RequestWithAuthState, app_user_id: str):
    print("ruda", app_user_id, request.state.app_user_id)
    try:
        is_viewing_other_user = request.state.app_user_id != UUID(app_user_id)

        palettes = get_palettes_by_app_user_id(
            UUID(app_user_id), only_approved=is_viewing_other_user
        )

        print("ruda", palettes)

        return {
            "success": True,
            "palettes": map_palette_array_to_response(palettes),
        }
    except Exception as e:
        log_error(e)
        return {
            "success": False,
            "error": "Failed to get palette",
        }
