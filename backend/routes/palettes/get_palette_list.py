import uuid

from common.models import ModerationStatus, SortBy
from fastapi import Query

from consts import ErrorMsg
from database.queries.palettes import get_palettes, get_palettes_count
from middleware.auth import RequestWithAuthState
from routes.shared import BaseErrorResponse, BaseSuccessResponse
from services.logger import log_error

from .palette_response_models import PaletteResponse, map_palette_array_to_response
from .palettes_router import palettes_router

ROUTE_NAME = "get_palette_list"


class SuccessResponse(BaseSuccessResponse):
    palettes: list[PaletteResponse]
    total: int


def calculate_can_see_all_moderation_statuses(
    app_user_id: uuid.UUID | None, author_user_id: uuid.UUID | None
) -> bool:
    # Only users can view their own palettes that aren't moderated yet.

    is_app_user_logged_in = app_user_id is not None
    is_app_user_author = app_user_id == author_user_id

    return is_app_user_logged_in and is_app_user_author


def handle_request(
    size: int,
    offset: int,
    moderation_status: ModerationStatus | None,
    author_user_id: uuid.UUID | None,
    sort_by: SortBy,
    color: str | None,
    app_user_id: uuid.UUID | None,
) -> SuccessResponse:
    can_see_all_moderation_statuses = calculate_can_see_all_moderation_statuses(
        app_user_id=app_user_id, author_user_id=author_user_id
    )

    if can_see_all_moderation_statuses:
        # Profile owner viewing own profile: use requested filter or show all
        effective_status = moderation_status
    else:
        # Everyone else: only show approved palettes
        effective_status = ModerationStatus.APPROVED

    palettes = get_palettes(
        size=size,
        offset=offset,
        moderation_status=effective_status,
        author_user_id=author_user_id,
        sort_by=sort_by,
        color=color,
        app_user_id=app_user_id,
    )

    total_count = get_palettes_count(
        moderation_status=effective_status,
        author_user_id=author_user_id,
    )
    return SuccessResponse(
        palettes=map_palette_array_to_response(palettes),
        total=total_count,
    )


@palettes_router.get("")
async def get_palette_list(
    request: RequestWithAuthState,
    size: int = Query(25, ge=1, le=100),
    offset: int = Query(0, ge=0),
    moderation_status: ModerationStatus | None = None,
    author_user_id: uuid.UUID | None = None,
    sort_by: SortBy = SortBy.NEWEST,
    color: str | None = None,
):
    try:
        return handle_request(
            size=size,
            offset=offset,
            moderation_status=moderation_status,
            author_user_id=author_user_id,
            sort_by=sort_by,
            app_user_id=request.state.app_user_id,
            color=color,
        )

    except Exception as error:
        log_error(error, ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.SOMETHING_WENT_WRONG)
