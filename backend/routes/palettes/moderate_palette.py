import uuid

from pydantic import BaseModel

from consts import ERROR_MSG
from database.models import ModerationStatus
from database.queries.palettes import update_palette_moderation_status
from middleware.auth import RequestWithAuthState
from routes.shared import AuthedRequest, BaseErrorResponse, BaseSuccessResponse, InvalidRequest
from services.logger import log_error
from utils.auth import user_is_moderator

from . import palettes_router


class Body(BaseModel):
    palette_id: uuid.UUID
    status: ModerationStatus


def parse_request(raw_request: RequestWithAuthState) -> AuthedRequest | InvalidRequest:
    if not user_is_moderator(raw_request):
        log_error(
            PermissionError(
                f"User {raw_request.state.app_user_id} is not a moderator but attempted to moderate a palette"
            ),
            "get_palette_list_as_moderator",
        )
        return InvalidRequest(error=ERROR_MSG.CANNOT_PERFORM_ACTION)

    return AuthedRequest(
        app_user_id=raw_request.state.app_user_id, auth_id=raw_request.state.auth_id
    )


@palettes_router.post("/moderate")
async def moderate(
    raw_request: RequestWithAuthState,
    body: Body,
):
    parsed_request = parse_request(raw_request)
    try:
        match parsed_request:
            case InvalidRequest(error=error):
                log_error(RuntimeError(error), "get_palette_list_as_moderator")
                return BaseErrorResponse(message=error)
            case AuthedRequest(app_user_id=_app_user_id):
                update_palette_moderation_status(body.palette_id, body.status)
                return BaseSuccessResponse()
    except Exception as error:
        log_error(error, "moderate_palette")
        return BaseErrorResponse(message=ERROR_MSG.SOMETHING_WENT_WRONG)
