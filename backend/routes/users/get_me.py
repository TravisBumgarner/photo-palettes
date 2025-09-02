import uuid

from consts import ERROR_MSG
from database.queries.users import get_app_user_by_auth_id
from middleware.auth import RequestWithAuthState
from routes.shared import AuthedRequest, BaseErrorResponse, BaseSuccessResponse, InvalidRequest
from services.logger import log_error
from utils.auth import get_user_auth

from . import users_router


def parse_request(raw_request: RequestWithAuthState) -> AuthedRequest | InvalidRequest:
    user_auth = get_user_auth(raw_request)
    if not user_auth:
        return InvalidRequest(error=ERROR_MSG.CANNOT_PERFORM_ACTION)

    return AuthedRequest(app_user_id=user_auth["app_user_id"], auth_id=user_auth["auth_id"])


ROUTE_NAME = "get_me"


class SuccessResponse(BaseSuccessResponse):
    id: uuid.UUID
    email: str
    displayName: str  # noqa #815
    permissionLevel: int  # noqa #815


@users_router.get("/me")
async def me(raw_request: RequestWithAuthState):
    try:
        parsed_request = parse_request(raw_request)

        match parsed_request:
            case InvalidRequest(error=error):
                log_error(RuntimeError(error), ROUTE_NAME)
                return BaseErrorResponse(message=error)
            case AuthedRequest(app_user_id=_app_user_id, auth_id=auth_id):
                app_user = get_app_user_by_auth_id(auth_id)
                if app_user is None:
                    log_error(
                        RuntimeError(ERROR_MSG.USER_DOES_NOT_EXIST),
                        ROUTE_NAME,
                    )
                    return BaseErrorResponse(message=ERROR_MSG.USER_DOES_NOT_EXIST)

        return SuccessResponse(
            id=app_user.id,
            email=app_user.email,
            displayName=app_user.display_name,
            permissionLevel=app_user.permission_level,
        )
    except Exception as error:
        log_error(error, ROUTE_NAME)
        return BaseErrorResponse(message=ERROR_MSG.SOMETHING_WENT_WRONG)
