from typing import Annotated

from fastapi import Query
from pydantic import BaseModel

from consts import ERROR_MSG
from database.models import SortBy
from database.queries.favorites import get_app_user_favorites, get_favorites_count
from middleware.auth import RequestWithAuthState
from routes.shared import AuthedRequest, BaseErrorResponse, InvalidRequest
from services.logger import log_error
from utils.auth import user_is_authed

from ..palettes.palette_response_models import PaletteResponse, map_palette_array_to_response
from . import favorites_router


class BaseSuccessResponse(BaseModel):
    palettes: list[PaletteResponse]
    success: bool = True
    total: int


def parse_request(raw_request: RequestWithAuthState) -> AuthedRequest | InvalidRequest:
    if not user_is_authed(raw_request):
        log_error(PermissionError("User is not authenticated"), "get_palette_favorites_list")
        return InvalidRequest(error=ERROR_MSG.USER_NOT_AUTHENTICATED)

    return AuthedRequest(
        app_user_id=raw_request.state.app_user_id, auth_id=raw_request.state.auth_id
    )


@favorites_router.get("")
async def get_favorite_palettes(
    raw_request: RequestWithAuthState,
    size: Annotated[int, Query(ge=1, le=100)] = 25,
    offset: Annotated[int, Query(ge=0)] = 0,
    sort_by: Annotated[SortBy, Query()] = SortBy.NEWEST,
):
    try:
        parsed_request = parse_request(raw_request)
        match parsed_request:
            case InvalidRequest(error=error):
                return BaseErrorResponse(success=False, message=error)
            case AuthedRequest(app_user_id=app_user_id):
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
    except Exception as error:
        log_error(error, "get_palette_list")
        return BaseErrorResponse(success=False, message=ERROR_MSG.SOMETHING_WENT_WRONG)
