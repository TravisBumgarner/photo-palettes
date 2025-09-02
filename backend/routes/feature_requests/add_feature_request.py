import uuid

from pydantic import BaseModel

from consts import ErrorMsg
from database.queries.feature_requests import add_feature_request
from middleware.auth import RequestWithAuthState
from routes.shared import AuthedRequest, BaseErrorResponse, BaseSuccessResponse, InvalidRequest
from services.logger import log_error
from utils.auth import get_moderator_auth

from .feature_requests_router import feature_requests_router


class SuccessResponse(BaseSuccessResponse):
    featureRequestId: uuid.UUID  # noqa #815


class Body(BaseModel):
    title: str
    description: str


ROUTE_NAME = "add_feature_request"


def parse_request(raw_request: RequestWithAuthState) -> AuthedRequest | InvalidRequest:
    moderator_auth = get_moderator_auth(raw_request)
    if not moderator_auth:
        return InvalidRequest(error=ErrorMsg.CANNOT_PERFORM_ACTION)

    return AuthedRequest(app_user_id=moderator_auth.app_user_id, auth_id=moderator_auth.auth_id)


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
                return SuccessResponse(featureRequestId=result)
    except Exception as e:
        log_error(e, ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.SOMETHING_WENT_WRONG)
