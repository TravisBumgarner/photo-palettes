import uuid

from common.models import ModerationStatus, PermissionLevel
from common.queries.palettes import PaletteUpdate, update_palette
from pydantic import BaseModel

from consts import ErrorMsg
from database import db_engine
from database.queries.palettes import get_palette_by_id
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
    share_to_socials: bool = False


ROUTE_NAME = "moderate_palette"


def handle_request(palette_id: uuid.UUID, status: ModerationStatus, share_to_socials: bool):
    palette_update = PaletteUpdate(moderation_status=status)
    update_palette(db_engine=db_engine, palette_id=palette_id, update=palette_update)

    if status == ModerationStatus.APPROVED and share_to_socials:
        palette = get_palette_by_id(palette_id)
        if not palette:
            raise RuntimeError("Palette not found after update")

    return BaseSuccessResponse()


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
        return handle_request(body.palette_id, body.status, body.share_to_socials)
    except Exception as error:
        log_error(error, ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.SOMETHING_WENT_WRONG)
