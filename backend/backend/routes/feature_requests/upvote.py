import uuid

from backend.database.queries.feature_requests import cast_vote, has_user_voted
from backend.middleware.auth import RequestWithAuthState
from backend.services.logger import log_error

from . import feature_requests_router


@feature_requests_router.post("/upvote/{feature_request_id}")
async def post_feature_request(request: RequestWithAuthState, feature_request_id: uuid.UUID):
    if has_user_voted(feature_request_id, request.state.app_user_id):
        return {
            "success": False,
            "error": "User has already voted",
        }

    try:
        cast_vote(feature_request_id, request.state.app_user_id)
        return {
            "success": True,
            "featureRequestId": feature_request_id,
        }
    except Exception as e:
        log_error(e)
        return {
            "success": False,
            "error": "Failed to upvote feature request",
        }
