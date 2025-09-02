from uuid import UUID

from consts import ErrorMsg
from database.queries.palettes import get_palette_by_id
from middleware.auth import RequestWithAuthState
from routes.shared import BaseErrorResponse, BaseSuccessResponse
from services.logger import log_error

from .palette_response_models import PaletteResponse, map_palette_to_response
from .palettes_router import palettes_router


def parse_request():
    # Shows no parsing required.
    pass


ROUTE_NAME = "get_palette_by_id"


class SuccessResponse(BaseSuccessResponse):
    palette: PaletteResponse


@palettes_router.get("/id/{id}")
async def get_by_id(raw_request: RequestWithAuthState, id: str):
    try:
        palette = get_palette_by_id(UUID(id), raw_request.state.app_user_id)
        if not palette:
            log_error(RuntimeError(ErrorMsg.RESOURCE_NOT_FOUND), ROUTE_NAME)
            return BaseErrorResponse(message=ErrorMsg.RESOURCE_NOT_FOUND)

        return SuccessResponse(palette=map_palette_to_response(palette))
    except Exception as e:
        log_error(e, ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.SOMETHING_WENT_WRONG)
