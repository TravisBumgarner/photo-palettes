import uuid
from typing import Annotated

from fastapi import Query
from pydantic import BaseModel

from consts import ErrorMsg
from database.models import PermissionLevel, SortBy
from database.queries.favorites import get_app_user_favorites, get_favorites_count
from middleware.auth import RequestWithAuthState
from routes.shared import BaseErrorResponse
from services.logger import log_error

from ..palettes.palette_response_models import (
    PaletteResponse,
    map_palette_array_to_response,
)
from .favorites_router import favorites_router

ROUTE_NAME = "get_palette_favorites_list"


class BaseSuccessResponse(BaseModel):
    palettes: list[PaletteResponse]
    success: bool = True
    total: int


def handle_request(size: int, offset: int, sort_by: SortBy, app_user_id: uuid.UUID):
    palettes = get_app_user_favorites(
        size=size,
        offset=offset,
        sort_by=sort_by,
        app_user_id=app_user_id,
    )

    total_count = get_favorites_count(app_user_id=app_user_id)
    return BaseSuccessResponse(
        palettes=map_palette_array_to_response(palettes),
        total=total_count,
    )


@favorites_router.get("")
async def get_favorite_palettes(
    request: RequestWithAuthState,
    size: Annotated[int, Query(ge=1, le=100)] = 25,
    offset: Annotated[int, Query(ge=0)] = 0,
    sort_by: Annotated[SortBy, Query()] = SortBy.NEWEST,
):
    if (
        request.state.permission_level < PermissionLevel.MEMBER
        or request.state.app_user_id is None
    ):
        log_error(RuntimeError(ErrorMsg.CANNOT_PERFORM_ACTION), ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.CANNOT_PERFORM_ACTION)

    try:
        return handle_request(
            size=size,
            offset=offset,
            sort_by=sort_by,
            app_user_id=request.state.app_user_id,
        )

    except Exception as error:
        log_error(error, ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.SOMETHING_WENT_WRONG)
