import uuid

from common.models import PermissionLevel

from consts import ErrorMsg
from database.queries.users import get_app_user_by_auth_id
from middleware.auth import RequestWithAuthState
from routes.shared import (
    BaseErrorResponse,
    BaseSuccessResponse,
)
from services.logger import log_error

from .users_router import users_router

ROUTE_NAME = "get_me"


class SuccessResponse(BaseSuccessResponse):
    id: uuid.UUID
    email: str
    displayName: str  # noqa #815
    permissionLevel: int  # noqa #815


def handle_request(auth_id: uuid.UUID):
    app_user = get_app_user_by_auth_id(auth_id)
    if app_user is None:
        log_error(RuntimeError(ErrorMsg.USER_DOES_NOT_EXIST), ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.USER_DOES_NOT_EXIST)

    return SuccessResponse(
        id=app_user.id,
        email=app_user.email,
        displayName=app_user.display_name,
        permissionLevel=app_user.permission_level,
    )


@users_router.get("/me")
async def me(request: RequestWithAuthState):
    if request.state.permission_level < PermissionLevel.MEMBER or request.state.auth_id is None:
        log_error(RuntimeError(ErrorMsg.CANNOT_PERFORM_ACTION), ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.CANNOT_PERFORM_ACTION)

    try:
        return handle_request(request.state.auth_id)
    except Exception as error:
        log_error(error, ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.SOMETHING_WENT_WRONG)
