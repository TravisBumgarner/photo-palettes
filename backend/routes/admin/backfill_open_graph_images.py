from common.models import ImageWorkerActionEnum, ModerationStatus, PermissionLevel
from common.queries.worker import insert_image_worker

from consts import ErrorMsg
from database.engine import db_engine
from database.queries.palettes import get_palettes
from middleware.auth import RequestWithAuthState
from routes.shared import (
    BaseErrorResponse,
    BaseSuccessResponse,
)
from services.logger import log_error

from .admin_router import admin_router

ROUTE_NAME = "/backfill_open_graph_images"


def handle_request():
    for moderation_status in ModerationStatus:
        palettes = get_palettes(
            moderation_status, size=10, offset=0
        )  # Should return a list of Palette objects
        for palette in palettes:
            insert_image_worker(
                db_engine=db_engine,
                palette_id=palette.id,
                action_type=ImageWorkerActionEnum.GENERATE_OG,
            )
    return BaseSuccessResponse()


@admin_router.get(ROUTE_NAME)
def backfill_open_graph_images(
    request: RequestWithAuthState,
):
    if request.state.permission_level < PermissionLevel.ADMIN:
        log_error(
            RuntimeError(ErrorMsg.CANNOT_PERFORM_ACTION),
            ROUTE_NAME,
            app_user_id=request.state.app_user_id,
        )
        return BaseErrorResponse(message=ErrorMsg.CANNOT_PERFORM_ACTION)

    try:
        return handle_request()
    except Exception as error:
        log_error(error, ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.SOMETHING_WENT_WRONG)
