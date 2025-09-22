from uuid import UUID

from common.queries.palettes import get_palette_by_id

from consts import ErrorMsg
from database.engine import db_engine
from middleware.auth import RequestWithAuthState
from routes.shared import BaseErrorResponse, BaseSuccessResponse
from services.logger import log_error

from .palette_response_models import PaletteResponse, map_palette_to_response
from .palettes_router import palettes_router

ROUTE_NAME = "get_palette_by_id"


class SuccessResponse(BaseSuccessResponse):
    palette: PaletteResponse


def handle_request(id: str, app_user_id: UUID | None):
    palette = get_palette_by_id(db_engine=db_engine, palette_id=UUID(id), app_user_id=app_user_id)
    if not palette:
        log_error(RuntimeError(ErrorMsg.RESOURCE_NOT_FOUND), ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.RESOURCE_NOT_FOUND)

    return SuccessResponse(palette=map_palette_to_response(palette))


@palettes_router.get("/id/{id}")
async def get_by_id(request: RequestWithAuthState, id: str):
    try:
        return handle_request(id, request.state.app_user_id)
    except Exception as e:
        log_error(e, ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.SOMETHING_WENT_WRONG)
