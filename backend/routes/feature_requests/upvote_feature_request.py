import uuid

from pydantic import BaseModel

from consts import ERROR_MSG
from database.queries.feature_requests import cast_vote, has_user_voted
from middleware.auth import RequestWithAuthState
from routes.shared import AuthedRequest, BaseErrorResponse, BaseSuccessResponse, InvalidRequest
from services.logger import log_error
from utils.auth import user_is_authed

from . import feature_requests_router


class Body(BaseModel):
    feature_request_id: uuid.UUID


def parse_request(raw_request: RequestWithAuthState):
    if not user_is_authed(raw_request):
        log_error(
            PermissionError("User is not authenticated"),
            "add_feature_request_not_moderator",
        )
        return InvalidRequest(error=ERROR_MSG.CANNOT_PERFORM_ACTION)

    return AuthedRequest(
        app_user_id=raw_request.state.app_user_id, auth_id=raw_request.state.auth_id
    )


@feature_requests_router.post("/upvote")
async def post_feature_request(raw_request: RequestWithAuthState, body: Body):
    try:
        parsed_request = parse_request(raw_request)

        match parsed_request:
            case InvalidRequest(error=error):
                log_error(RuntimeError(error), "upvote_feature_request_invalid")
                return {
                    "success": False,
                    "error": error,
                }
            case AuthedRequest(app_user_id=app_user_id):
                if has_user_voted(body.feature_request_id, app_user_id):
                    BaseErrorResponse(success=False, message="User has already voted")
                    return

                cast_vote(body.feature_request_id, app_user_id)
                return BaseSuccessResponse()
    except Exception as e:
        log_error(e, "upvote_feature_request")
        return BaseErrorResponse(message="Failed to upvote feature request")
