import uuid

from consts import ErrorMsg
from database.queries.users import delete_app_user_by_app_user_id, get_app_user_by_app_user_id
from middleware.auth import RequestWithAuthState
from routes.shared import (
    BaseErrorResponse,
    BaseSuccessResponse,
)
from services.logger import log_error
from services.supabase import delete_user

from .users_router import users_router

ROUTE_NAME = "delete_me"


def handle_request(app_user_id: uuid.UUID):
    app_user = get_app_user_by_app_user_id(app_user_id)
    if app_user is None:
        log_error(RuntimeError(ErrorMsg.USER_DOES_NOT_EXIST), ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.USER_DOES_NOT_EXIST)
    success = delete_app_user_by_app_user_id(app_user_id)
    if success:
        try:
            delete_user(str(app_user.auth_id))
        except Exception as error:
            log_error(error, ROUTE_NAME)
            return BaseErrorResponse(message=ErrorMsg.SOMETHING_WENT_WRONG)
    return BaseSuccessResponse(success=success)


@users_router.delete("/me")
async def me(request: RequestWithAuthState):
    if request.state.app_user_id is None:
        log_error(RuntimeError(ErrorMsg.CANNOT_PERFORM_ACTION), ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.CANNOT_PERFORM_ACTION)

    try:
        return handle_request(request.state.app_user_id)
    except Exception as error:
        log_error(error, ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.SOMETHING_WENT_WRONG)
