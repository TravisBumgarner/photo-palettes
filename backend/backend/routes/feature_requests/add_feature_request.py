from pydantic import BaseModel

from backend.database.queries.feature_requests import add_feature_request
from backend.middleware.auth import RequestWithAuthState
from backend.services.logger import log_error
from backend.utils.auth import user_is_moderator

from . import feature_requests_router


class AddFeatureRequest(BaseModel):
    title: str
    description: str


def validate_request(request: RequestWithAuthState):
    if not user_is_moderator(request):
        log_error(
            PermissionError(
                f"User {request.state.app_user_id} is not a moderator but attempted to moderate a palette"
            )
        )
        return {
            "success": False,
            "error": "User is not a moderator",
        }

    return None


@feature_requests_router.post("/")
async def post_feature_request(request: RequestWithAuthState, feature_request: AddFeatureRequest):
    validation_error = validate_request(request)
    if validation_error:
        return validation_error

    try:
        request_id = add_feature_request(feature_request.title, feature_request.description)
        return {
            "success": True,
            "featureRequestId": request_id,
        }
    except Exception as e:
        log_error(e)
        return {
            "success": False,
            "error": "Failed to add feature request",
        }
