import uuid

from pydantic import BaseModel

from consts import ErrorMsg
from database.models import PermissionLevel
from database.queries.feature_requests import cast_vote, has_user_voted
from middleware.auth import RequestWithAuthState
from routes.shared import (
    BaseErrorResponse,
    BaseSuccessResponse,
)
from services.logger import log_error

from .feature_requests_router import feature_requests_router

ROUTE_NAME = "upvote_feature_request"


class Body(BaseModel):
    feature_request_id: uuid.UUID


def handle_request(feature_request_id: uuid.UUID, app_user_id: uuid.UUID):
    if has_user_voted(feature_request_id, app_user_id):
        log_error(RuntimeError(ErrorMsg.CANNOT_PERFORM_ACTION), ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.CANNOT_PERFORM_ACTION)

    cast_vote(feature_request_id, app_user_id)
    return BaseSuccessResponse()


@feature_requests_router.post("/upvote")
async def post_feature_request(request: RequestWithAuthState, body: Body):
    if request.state.permission_level < PermissionLevel.MEMBER or request.state.app_user_id is None:
        log_error(RuntimeError(ErrorMsg.CANNOT_PERFORM_ACTION), ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.CANNOT_PERFORM_ACTION)

    try:
        return handle_request(body.feature_request_id, request.state.app_user_id)
    except Exception as e:
        log_error(e, ROUTE_NAME)
        return BaseErrorResponse(message="Failed to upvote feature request")
