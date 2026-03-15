import uuid

from common.models import ModerationStatus, Palette, PermissionLevel
from common.queries.palettes import PaletteUpdate, update_palette
from pydantic import BaseModel
from sqlalchemy.orm import Session

from consts import ErrorMsg
from database.engine import db_engine
from middleware.auth import RequestWithAuthState
from routes.shared import BaseErrorResponse, BaseSuccessResponse
from services.logger import log_error
from services.pushover import send_pushover_notification

from .palettes_router import palettes_router

ROUTE_NAME = "submit_to_public"


class Body(BaseModel):
    palette_id: uuid.UUID


@palettes_router.post("/submit_to_public")
async def submit_to_public(
    request: RequestWithAuthState,
    body: Body,
):
    if request.state.permission_level < PermissionLevel.MEMBER:
        return BaseErrorResponse(message=ErrorMsg.CANNOT_PERFORM_ACTION)

    try:
        with Session(db_engine) as session:
            palette = session.query(Palette).filter(Palette.id == body.palette_id).first()
            if not palette:
                return BaseErrorResponse(message=ErrorMsg.RESOURCE_NOT_FOUND)

            if palette.app_user_id != request.state.app_user_id:
                return BaseErrorResponse(message=ErrorMsg.CANNOT_PERFORM_ACTION)

            if palette.moderation_status != ModerationStatus.PRIVATE:
                return BaseErrorResponse(message="Palette is not private")

        palette_update = PaletteUpdate(moderation_status=ModerationStatus.AWAITING_MODERATION)
        update_palette(db_engine=db_engine, palette_id=body.palette_id, update=palette_update)

        send_pushover_notification(f"Palette submitted for review: {palette.name}")
        return BaseSuccessResponse()

    except Exception as error:
        log_error(error, ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.SOMETHING_WENT_WRONG)
