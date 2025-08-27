import uuid

from consts import ERROR_MSG
from database.models import Palette
from database.queries.palettes import delete_palette_by_id, get_palette_by_id
from middleware.auth import RequestWithAuthState
from routes.shared import AuthedRequest, BaseErrorResponse, BaseSuccessResponse, InvalidRequest
from services.logger import log_error
from utils.auth import user_is_moderator
from utils.photos import delete_photo

from . import palettes_router


def parse_request(
    raw_request: RequestWithAuthState, palette: Palette | None
) -> tuple[AuthedRequest, Palette] | tuple[InvalidRequest, None]:
    if not user_is_moderator(raw_request):
        log_error(
            PermissionError(
                f"User {raw_request.state.app_user_id} is not a moderator but attempted to delete a palette"
            ),
            "delete_not_moderator",
        )
        return (InvalidRequest(error=ERROR_MSG.CANNOT_PERFORM_ACTION), None)

    if not palette:
        return (InvalidRequest(error=ERROR_MSG.RESOURCE_NOT_FOUND), None)

    return (
        AuthedRequest(app_user_id=raw_request.state.app_user_id, auth_id=raw_request.state.auth_id),
        palette,
    )


@palettes_router.delete("/id/{id}")
async def delete_palette(
    request: RequestWithAuthState,
    id: str,
):
    try:
        palette = get_palette_by_id(uuid.UUID(id), request.state.app_user_id)
        [parsed_request, palette] = parse_request(request, palette)

        match parsed_request:
            case InvalidRequest(error=error):
                log_error(RuntimeError(error), "delete_palette_invalid")
                return BaseErrorResponse(message=error)

            case AuthedRequest(app_user_id=_app_user_id):
                delete_photo(palette.photo_details)
                delete_photo(palette.og_photo_details)
                delete_palette_by_id(palette.id)
                return BaseSuccessResponse()
    except Exception as e:
        log_error(e, "delete_palette")
        return BaseErrorResponse(message=ERROR_MSG.SOMETHING_WENT_WRONG)
