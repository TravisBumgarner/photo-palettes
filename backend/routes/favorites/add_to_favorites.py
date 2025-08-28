import uuid

from pydantic import BaseModel

from consts import ERROR_MSG
from database.queries.favorites import add_palette_to_favorites
from middleware.auth import RequestWithAuthState
from routes.shared import AuthedRequest, BaseErrorResponse, BaseSuccessResponse, InvalidRequest
from services.logger import log_error
from utils.auth import user_is_authed

from . import favorites_router

ROUTE_NAME = "add_to_favorites"


class Body(BaseModel):
    palette_id: uuid.UUID


def parse_request(raw_request: RequestWithAuthState) -> AuthedRequest | InvalidRequest:
    if not user_is_authed(raw_request):
        return InvalidRequest(error=ERROR_MSG.USER_NOT_AUTHENTICATED)

    return AuthedRequest(
        app_user_id=raw_request.state.app_user_id, auth_id=raw_request.state.auth_id
    )


@favorites_router.post("/add")
async def add_to_favorites(raw_request: RequestWithAuthState, body: Body):
    try:
        parsed_request = parse_request(raw_request)

        match parsed_request:
            case InvalidRequest(error=error):
                log_error(RuntimeError(error), ROUTE_NAME)
                return BaseErrorResponse(message=error)
            case AuthedRequest(app_user_id=app_user_id):
                add_palette_to_favorites(app_user_id, body.palette_id)
                return BaseSuccessResponse()
    except Exception as e:
        log_error(e, ROUTE_NAME)
        return BaseErrorResponse(message=ERROR_MSG.SOMETHING_WENT_WRONG)
