import uuid
from typing import Annotated

from fastapi import Query
from pydantic import BaseModel

from consts import ERROR_MSG
from database.models import SortBy
from database.queries.favorites import get_app_user_favorites, get_favorites_count
from middleware.auth import RequestWithAuthState
from services.logger import log_error
from utils.auth import user_is_authed

from ..palettes.palette_response_models import map_palette_array_to_response
from . import favorites_router


class Response(BaseModel):
    success: bool
    message: str | None = None


class ValidRequest(BaseModel):
    app_user_id: uuid.UUID
    palette_id: uuid.UUID


class InvalidRequest(BaseModel):
    error: str


def parse_request(raw_request: RequestWithAuthState):
    if not user_is_authed(raw_request):
        return InvalidRequest(error=ERROR_MSG.USER_NOT_AUTHENTICATED)

    return ValidRequest(success=True)


@favorites_router.get("")
async def get_favorite_palettes(
    raw_request: RequestWithAuthState,
    size: Annotated[int, Query(ge=1, le=100)] = 25,
    offset: Annotated[int, Query(ge=0)] = 0,
    sort_by: Annotated[SortBy, Query()] = SortBy.NEWEST,
):
    try:
        if not raw_request.state.app_user_id:
            return {
                "success": False,
                "error": "Unauthorized",
            }

        palettes = get_app_user_favorites(
            size=size,
            offset=offset,
            sort_by=sort_by,
            app_user_id=raw_request.state.app_user_id,
        )

        total_count = get_favorites_count(app_user_id=raw_request.state.app_user_id)
        return {
            "success": True,
            "palettes": map_palette_array_to_response(palettes),
            "total": total_count,
        }

    except Exception as error:
        log_error(error, "get_palette_list")

        return Response(success=False, message=ERROR_MSG.SOMETHING_WENT_WRONG)
