from common.models import PermissionLevel

from consts import ErrorMsg
from database.queries.palettes import get_colors, update_color
from middleware.auth import RequestWithAuthState
from routes.shared import (
    BaseErrorResponse,
    BaseSuccessResponse,
)
from services.logger import log_error
from utils.colors import closest_color_name

from .admin_router import admin_router

ROUTE_NAME = "/backfill_color_names"


def handle_request():
    # Paginate through all palettes to avoid memory issues with large datasets
    page_size = 100
    total_processed = 0

    offset = 0
    while True:
        palette_colors = get_colors(size=page_size, offset=offset)

        if not palette_colors:  # No more palettes for this status
            break

        for palette_color in palette_colors:
            color_name = closest_color_name((palette_color.r, palette_color.g, palette_color.b))
            # Pass the ID and name, not the object itself
            update_color(palette_color.id, color_name)
            total_processed += 1

        offset += page_size

        # Break if we got fewer results than page_size (last page)
        if len(palette_colors) < page_size:
            break

    return BaseSuccessResponse()


@admin_router.get(ROUTE_NAME)
def backfill_color_names(
    request: RequestWithAuthState,
):
    if request.state.permission_level < PermissionLevel.ADMIN:
        log_error(
            RuntimeError(ErrorMsg.CANNOT_PERFORM_ACTION),
            ROUTE_NAME,
            app_user_id=request.state.app_user_id,
        )
        return BaseErrorResponse(message=ErrorMsg.CANNOT_PERFORM_ACTION)

    try:
        return handle_request()
    except Exception as error:
        log_error(error, ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.SOMETHING_WENT_WRONG)
