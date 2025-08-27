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


def parse_request(raw_request: RequestWithAuthState) -> AuthedRequest | InvalidRequest:
    if not user_is_moderator(raw_request):
        log_error(
            PermissionError(
                f"User {raw_request.state.app_user_id} is not a moderator but attempted to moderate a palette"
            ),
            "add_feature_request_not_moderator",
        )
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
                log_error(RuntimeError(error), "add_feature_request_invalid")
                return BaseErrorResponse(success=False, message=error)
            case AuthedRequest(app_user_id=_app_user_id):
                result = add_feature_request(body.title, body.description)
                return BaseSuccessResponse(featureRequestId=result)
    except Exception as e:
        log_error(e, "add_feature_request")
        return BaseErrorResponse(success=False, message=ERROR_MSG.SOMETHING_WENT_WRONG)
