from typing import Annotated

from fastapi import Query

from consts import ErrorMsg
from database.models import ModerationStatus
from database.queries.palettes import get_palettes, get_palettes_count
from middleware.auth import RequestWithAuthState
from routes.shared import AuthedRequest, BaseErrorResponse, BaseSuccessResponse, InvalidRequest
from services.logger import log_error
from utils.auth import get_moderator_auth

from .palette_response_models import PaletteResponse, map_palette_array_to_response
from .palettes_router import palettes_router


def parse_request(raw_request: RequestWithAuthState) -> AuthedRequest | InvalidRequest:
    moderator_auth = get_moderator_auth(raw_request)
    if not moderator_auth:
        return InvalidRequest(error=ErrorMsg.CANNOT_PERFORM_ACTION)

    return AuthedRequest(app_user_id=moderator_auth.app_user_id, auth_id=moderator_auth.auth_id)


ROUTE_NAME = "get_palette_list_as_moderator"


class SuccessResponse(BaseSuccessResponse):
    palettes: list[PaletteResponse]
    total: int


@palettes_router.get("/moderator")
def get_list_as_moderator(
    raw_request: RequestWithAuthState,
    status: ModerationStatus,
    size: Annotated[int, Query(ge=1, le=100)] = 25,
    offset: Annotated[int, Query(ge=0)] = 0,
):
    try:
        parsed_request = parse_request(raw_request)

        match parsed_request:
            case InvalidRequest(error=error):
                log_error(RuntimeError(error), ROUTE_NAME)
                return BaseErrorResponse(message=error)
            case AuthedRequest(app_user_id=_app_user_id):
                palettes = get_palettes(
                    moderation_status=status,
                    size=size,
                    offset=offset,
                )
                total = get_palettes_count(moderation_status=status)

                return SuccessResponse(
                    palettes=map_palette_array_to_response(palettes),
                    total=total,
                )

    except Exception as error:
        log_error(error, ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.SOMETHING_WENT_WRONG)
