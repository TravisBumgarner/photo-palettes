import uuid

from consts import ERROR_MSG
from database.models import Palette
from database.queries.palettes import delete_palette_by_id, get_palette_by_id
from middleware.auth import RequestWithAuthState
from routes.shared import AuthedRequest, BaseErrorResponse, BaseSuccessResponse, InvalidRequest
from services.logger import log_error
from utils.auth import get_moderator_auth
from utils.photos import delete_photo

from . import palettes_router

ROUTE_NAME = "delete_palette"


def parse_request(
    raw_request: RequestWithAuthState, palette: Palette | None
) -> tuple[AuthedRequest, Palette] | tuple[InvalidRequest, None]:
    moderator_auth = get_moderator_auth(raw_request)

    if not moderator_auth:
        return (InvalidRequest(error=ERROR_MSG.CANNOT_PERFORM_ACTION), None)

    if not palette:
        return (InvalidRequest(error=ERROR_MSG.RESOURCE_NOT_FOUND), None)

    return (
        AuthedRequest(app_user_id=moderator_auth["app_user_id"], auth_id=moderator_auth["auth_id"]),
        palette,
    )


@palettes_router.delete("/id/{id}")
async def delete_palette(
    raw_request: RequestWithAuthState,
    id: str,
):
    try:
        palette = get_palette_by_id(uuid.UUID(id), raw_request.state.app_user_id)
        [parsed_request, palette] = parse_request(raw_request, palette)

        match parsed_request:
            case InvalidRequest(error=error):
                log_error(
                    RuntimeError(error), ROUTE_NAME, app_user_id=raw_request.state.app_user_id
                )
                return BaseErrorResponse(message=error)

            case AuthedRequest(app_user_id=_app_user_id):
                delete_photo(palette.photo_details)
                delete_photo(palette.og_photo_details)
                delete_palette_by_id(palette.id)
                return BaseSuccessResponse()
    except Exception as e:
        log_error(e, ROUTE_NAME)
        return BaseErrorResponse(message=ERROR_MSG.SOMETHING_WENT_WRONG)
