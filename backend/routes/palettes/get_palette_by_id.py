from uuid import UUID

from consts import ERROR_MSG
from database.queries.palettes import get_palette_by_id
from middleware.auth import RequestWithAuthState
from routes.shared import BaseErrorResponse, BaseSuccessResponse
from services.logger import log_error

from . import palettes_router
from .palette_response_models import PaletteResponse, map_palette_to_response


def parse_request():
    # Shows no parsing required.
    pass


class SuccessResponse(BaseSuccessResponse):
    palette: PaletteResponse


@palettes_router.get("/id/{id}")
async def get_by_id(request: RequestWithAuthState, id: str):
    try:
        parse_request()

        palette = get_palette_by_id(UUID(id), request.state.app_user_id)
        if not palette:
            return BaseErrorResponse(message=ERROR_MSG.RESOURCE_NOT_FOUND)

        return SuccessResponse(palette=map_palette_to_response(palette))
    except Exception as e:
        log_error(e, "get_palette_by_id")
        return BaseErrorResponse(success=False, message=ERROR_MSG.SOMETHING_WENT_WRONG)
