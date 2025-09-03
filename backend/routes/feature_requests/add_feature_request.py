import uuid

from pydantic import BaseModel

from consts import ErrorMsg
from database.models import PermissionLevel
from database.queries.feature_requests import add_feature_request
from middleware.auth import RequestWithAuthState
from routes.shared import (
    BaseErrorResponse,
    BaseSuccessResponse,
)
from services.logger import log_error

from .feature_requests_router import feature_requests_router


class SuccessResponse(BaseSuccessResponse):
    featureRequestId: uuid.UUID  # noqa #815


class Body(BaseModel):
    title: str
    description: str


ROUTE_NAME = "add_feature_request"


@feature_requests_router.post("/")
async def post_feature_request(request: RequestWithAuthState, body: Body):
    if (
        request.state.permission_level < PermissionLevel.MODERATOR
        or request.state.app_user_id is None
    ):
        log_error(
            RuntimeError(ErrorMsg.CANNOT_PERFORM_ACTION),
            ROUTE_NAME,
            app_user_id=request.state.app_user_id,
        )
        return BaseErrorResponse(message=ErrorMsg.CANNOT_PERFORM_ACTION)

    try:
        result = add_feature_request(body.title, body.description)
        return SuccessResponse(featureRequestId=result)
    except Exception as e:
        log_error(e, ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.SOMETHING_WENT_WRONG)
