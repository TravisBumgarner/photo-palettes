from fastapi import Query

from database.models import SortBy
from database.queries.favorites import get_app_user_favorites, get_favorites_count
from middleware.auth import RequestWithAuthState
from services.logger import log_error

from ..palettes.palette_response_models import map_palette_array_to_response
from . import favorites_router


@favorites_router.get("")
async def get_favorite_palettes(
    request: RequestWithAuthState,
    size: int = Query(25, ge=1, le=100),
    offset: int = Query(0, ge=0),
    sort_by: SortBy = SortBy.NEWEST,
):
    try:
        if not request.state.app_user_id:
            return {
                "success": False,
                "error": "Unauthorized",
            }

        palettes = get_app_user_favorites(
            size=size,
            offset=offset,
            sort_by=sort_by,
            app_user_id=request.state.app_user_id,
        )

        total_count = get_favorites_count(app_user_id=request.state.app_user_id)
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
