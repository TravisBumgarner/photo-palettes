import uuid

from pydantic import BaseModel

from consts import ERROR_MSG
from database.queries.feature_requests import add_feature_request
from middleware.auth import RequestWithAuthState
from routes.shared import AuthedRequest, BaseErrorResponse, InvalidRequest
from services.logger import log_error
from utils.auth import user_is_moderator

from . import feature_requests_router


class BaseSuccessResponse(BaseModel):
    featureRequestId: uuid.UUID  # noqa #815
    success: bool = True


class Body(BaseModel):
    title: str
    description: str


ROUTE_NAME = "add_feature_request"


def parse_request(raw_request: RequestWithAuthState) -> AuthedRequest | InvalidRequest:
    if not user_is_moderator(raw_request):
        return InvalidRequest(error=ERROR_MSG.CANNOT_PERFORM_ACTION)

    return AuthedRequest(
        app_user_id=raw_request.state.app_user_id, auth_id=raw_request.state.auth_id
    )


@feature_requests_router.post("/")
async def post_feature_request(raw_request: RequestWithAuthState, body: Body):
    try:
        parsed_request = parse_request(raw_request)

        match parsed_request:
            case InvalidRequest(error=error):
                log_error(
                    RuntimeError(error), ROUTE_NAME, app_user_id=raw_request.state.app_user_id
                )
                return BaseErrorResponse(message=error)
            case AuthedRequest(app_user_id=_app_user_id):
                result = add_feature_request(body.title, body.description)
                return BaseSuccessResponse(featureRequestId=result)
    except Exception as e:
        log_error(e, ROUTE_NAME)
        return BaseErrorResponse(message=ERROR_MSG.SOMETHING_WENT_WRONG)
