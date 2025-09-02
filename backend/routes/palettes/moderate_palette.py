import uuid

from pydantic import BaseModel

from consts import ErrorMsg
from database.models import ModerationStatus
from database.queries.palettes import update_palette_moderation_status
from middleware.auth import RequestWithAuthState
from routes.shared import AuthedRequest, BaseErrorResponse, BaseSuccessResponse, InvalidRequest
from services.logger import log_error
from utils.auth import get_moderator_auth

from .palettes_router import palettes_router


class Body(BaseModel):
    palette_id: uuid.UUID
    status: ModerationStatus


ROUTE_NAME = "moderate_palette"


def parse_request(raw_request: RequestWithAuthState) -> AuthedRequest | InvalidRequest:
    moderator_auth = get_moderator_auth(raw_request)
    if not moderator_auth:
        return InvalidRequest(error=ErrorMsg.CANNOT_PERFORM_ACTION)

    return AuthedRequest(app_user_id=moderator_auth.app_user_id, auth_id=moderator_auth.auth_id)


@palettes_router.post("/moderate")
async def moderate(
    raw_request: RequestWithAuthState,
    body: Body,
):
    parsed_request = parse_request(raw_request)
    try:
        match parsed_request:
            case InvalidRequest(error=error):
                log_error(
                    RuntimeError(error), ROUTE_NAME, app_user_id=raw_request.state.app_user_id
                )
                return BaseErrorResponse(message=error)
            case AuthedRequest(app_user_id=_app_user_id):
                update_palette_moderation_status(body.palette_id, body.status)
                return BaseSuccessResponse()
    except Exception as error:
        log_error(error, ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.SOMETHING_WENT_WRONG)
