import uuid

from pydantic import BaseModel

from consts import ErrorMsg
from database.queries.feature_requests import cast_vote, has_user_voted
from middleware.auth import RequestWithAuthState
from routes.shared import AuthedRequest, BaseErrorResponse, BaseSuccessResponse, InvalidRequest
from services.logger import log_error
from utils.auth import get_user_auth

from .feature_requests_router import feature_requests_router

ROUTE_NAME = "upvote_feature_request"


class Body(BaseModel):
    feature_request_id: uuid.UUID


def parse_request(raw_request: RequestWithAuthState):
    user_auth = get_user_auth(raw_request)
    if not user_auth:
        return InvalidRequest(error=ErrorMsg.CANNOT_PERFORM_ACTION)

    return AuthedRequest(auth_id=user_auth.auth_id, app_user_id=user_auth.app_user_id)


@feature_requests_router.post("/upvote")
async def post_feature_request(raw_request: RequestWithAuthState, body: Body):
    try:
        parsed_request = parse_request(raw_request)

        match parsed_request:
            case InvalidRequest(error=error):
                log_error(RuntimeError(error), ROUTE_NAME)
                return BaseErrorResponse(message=error)
            case AuthedRequest(app_user_id=app_user_id):
                if has_user_voted(body.feature_request_id, app_user_id):
                    log_error(RuntimeError(ErrorMsg.CANNOT_PERFORM_ACTION), ROUTE_NAME)
                    return BaseErrorResponse(message=ErrorMsg.CANNOT_PERFORM_ACTION)

                cast_vote(body.feature_request_id, app_user_id)
                return BaseSuccessResponse()
    except Exception as e:
        log_error(e, ROUTE_NAME)
        return BaseErrorResponse(message="Failed to upvote feature request")
