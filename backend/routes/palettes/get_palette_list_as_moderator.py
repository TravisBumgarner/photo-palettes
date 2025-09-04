from typing import Annotated

from consts import ErrorMsg
from database.models import ModerationStatus, PermissionLevel
from database.queries.palettes import get_palettes, get_palettes_count
from fastapi import Query
from middleware.auth import RequestWithAuthState
from routes.shared import (
    BaseErrorResponse,
    BaseSuccessResponse,
)
from services.logger import log_error

from .palette_response_models import PaletteResponse, map_palette_array_to_response
from .palettes_router import palettes_router

ROUTE_NAME = "get_palette_list_as_moderator"


class SuccessResponse(BaseSuccessResponse):
    palettes: list[PaletteResponse]
    total: int


def handle_request(
    moderation_status: ModerationStatus,
    size: int,
    offset: int,
) -> SuccessResponse:
    palettes = get_palettes(
        moderation_status=moderation_status,
        size=size,
        offset=offset,
    )
    total = get_palettes_count(moderation_status=moderation_status)
    return SuccessResponse(
        palettes=map_palette_array_to_response(palettes),
        total=total,
    )


@palettes_router.get("/moderator")
def get_list_as_moderator(
    request: RequestWithAuthState,
    status: ModerationStatus,
    size: Annotated[int, Query(ge=1, le=100)] = 25,
    offset: Annotated[int, Query(ge=0)] = 0,
):
    if request.state.permission_level < PermissionLevel.MODERATOR:
        return BaseErrorResponse(message=ErrorMsg.CANNOT_PERFORM_ACTION)

    try:
        return handle_request(
            moderation_status=status,
            size=size,
            offset=offset,
        )

    except Exception as error:
        log_error(error, ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.SOMETHING_WENT_WRONG)
