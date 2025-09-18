import uuid

from common.models import PermissionLevel

from consts import ErrorMsg
from database.queries.palettes import delete_palette_by_id, get_palette_by_id
from middleware.auth import RequestWithAuthState
from routes.shared import (
    BaseErrorResponse,
    BaseSuccessResponse,
)
from services.logger import log_error
from utils.photos import delete_photo

from .palettes_router import palettes_router

ROUTE_NAME = "delete_palette"


def handle_request(id: str, app_user_id: uuid.UUID):
    palette = get_palette_by_id(uuid.UUID(id), app_user_id)
    if not palette:
        return BaseErrorResponse(message=ErrorMsg.RESOURCE_NOT_FOUND)

    delete_photo(palette.photo_details)
    delete_photo(palette.og_photo_details)
    delete_palette_by_id(palette.id)
    return BaseSuccessResponse()


@palettes_router.delete("/id/{id}")
async def delete_palette(
    request: RequestWithAuthState,
    id: str,
):
    if (
        request.state.permission_level < PermissionLevel.MODERATOR
        or request.state.app_user_id is None
    ):
        log_error(
            RuntimeError("User does not have permission to delete palettes"),
            ROUTE_NAME,
            app_user_id=request.state.app_user_id,
        )
        return BaseErrorResponse(
            message=ErrorMsg.CANNOT_PERFORM_ACTION,
        )

    try:
        return handle_request(id, request.state.app_user_id)
    except Exception as e:
        log_error(e, ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.SOMETHING_WENT_WRONG)
