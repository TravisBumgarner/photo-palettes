import uuid

from consts import ErrorMsg
from database.models import PermissionLevel
from database.queries.favorites import add_palette_to_favorites
from middleware.auth import RequestWithAuthState
from pydantic import BaseModel
from routes.shared import (
    BaseErrorResponse,
    BaseSuccessResponse,
)
from services.logger import log_error

from .favorites_router import favorites_router

ROUTE_NAME = "add_to_favorites"


class Body(BaseModel):
    palette_id: uuid.UUID


def handle_request(app_user_id: uuid.UUID, palette_id: uuid.UUID):
    add_palette_to_favorites(app_user_id, palette_id)
    return BaseSuccessResponse()


@favorites_router.post("/add")
async def add_to_favorites(request: RequestWithAuthState, body: Body):
    if (
        request.state.permission_level < PermissionLevel.MEMBER
        or request.state.app_user_id is None
    ):
        log_error(RuntimeError(ErrorMsg.CANNOT_PERFORM_ACTION), ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.CANNOT_PERFORM_ACTION)

    try:
        return handle_request(request.state.app_user_id, body.palette_id)
    except Exception as e:
        log_error(e, ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.SOMETHING_WENT_WRONG)
