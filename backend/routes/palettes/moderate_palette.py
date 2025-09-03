import uuid

from pydantic import BaseModel

from consts import ErrorMsg
from database.models import ModerationStatus, PermissionLevel
from database.queries.palettes import update_palette_moderation_status
from middleware.auth import RequestWithAuthState
from routes.shared import (
    BaseErrorResponse,
    BaseSuccessResponse,
)
from services.logger import log_error

from .palettes_router import palettes_router


class Body(BaseModel):
    palette_id: uuid.UUID
    status: ModerationStatus


ROUTE_NAME = "moderate_palette"


@palettes_router.post("/moderate")
async def moderate(
    request: RequestWithAuthState,
    body: Body,
):
    if request.state.permission_level < PermissionLevel.MODERATOR:
        log_error(
            RuntimeError(ErrorMsg.CANNOT_PERFORM_ACTION),
            ROUTE_NAME,
            app_user_id=request.state.app_user_id,
        )
        return BaseErrorResponse(message=ErrorMsg.CANNOT_PERFORM_ACTION)

    try:
        update_palette_moderation_status(body.palette_id, body.status)
        return BaseSuccessResponse()
    except Exception as error:
        log_error(error, ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.SOMETHING_WENT_WRONG)
