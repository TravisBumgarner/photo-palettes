import uuid

from pydantic import BaseModel

from database.queries.feature_requests import cast_vote, has_user_voted
from middleware.auth import RequestWithAuthState
from services.logger import log_error

from . import feature_requests_router


class UpvoteRequest(BaseModel):
    feature_request_id: uuid.UUID


@feature_requests_router.post("/upvote")
async def post_feature_request(request: RequestWithAuthState, upvote_request: UpvoteRequest):
    if has_user_voted(upvote_request.feature_request_id, request.state.app_user_id):
        return {
            "success": False,
            "error": "User has already voted",
        }

    try:
        cast_vote(upvote_request.feature_request_id, request.state.app_user_id)
        return {
            "success": True,
            "featureRequestId": upvote_request.feature_request_id,
        }
    except Exception as e:
        log_error(e, "upvote_feature_request")
        return {
            "success": False,
            "error": "Failed to upvote feature request",
        }
