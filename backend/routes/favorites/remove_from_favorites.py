import uuid

from pydantic import BaseModel

from consts import ErrorMsg
from database.queries.favorites import remove_palette_from_favorites
from middleware.auth import RequestWithAuthState
from routes.shared import AuthedRequest, BaseErrorResponse, BaseSuccessResponse, InvalidRequest
from services.logger import log_error
from utils.auth import get_user_auth

from .favorites_router import favorites_router

ROUTE_NAME = "remove_from_favorites"


class Body(BaseModel):
    palette_id: uuid.UUID


def parse_request(raw_request: RequestWithAuthState) -> AuthedRequest | InvalidRequest:
    user_auth = get_user_auth(raw_request)
    if not user_auth:
        return InvalidRequest(error=ErrorMsg.USER_NOT_AUTHENTICATED)

    return AuthedRequest(auth_id=user_auth.auth_id, app_user_id=user_auth.app_user_id)


@favorites_router.post("/remove")
async def remove_to_favorites(raw_request: RequestWithAuthState, body: Body):
    try:
        parsed_request = parse_request(raw_request)

        match parsed_request:
            case InvalidRequest(error=error):
                log_error(RuntimeError(error), ROUTE_NAME)
                return BaseErrorResponse(message=error)
            case AuthedRequest(app_user_id=app_user_id):
                result = remove_palette_from_favorites(app_user_id, body.palette_id)
                if result:
                    return BaseSuccessResponse()
                else:
                    log_error(RuntimeError("Failed to remove palette from favorites"), ROUTE_NAME)
                    return BaseErrorResponse(message=ErrorMsg.SOMETHING_WENT_WRONG)

    except Exception as e:
        log_error(e, ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.SOMETHING_WENT_WRONG)
