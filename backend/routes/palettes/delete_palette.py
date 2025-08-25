import uuid

from database.models import Palette
from database.queries.palettes import delete_palette_by_id, get_palette_by_id
from middleware.auth import RequestWithAuthState
from services.logger import log_error
from utils.auth import user_is_moderator
from utils.photos import delete_photo

from . import palettes_router


def validate_request(request: RequestWithAuthState, palette: Palette):
    user_owns_resource = request.state.app_user_id == palette.app_user_id
    if user_owns_resource:
        return None

    if not user_is_moderator(request):
        log_error(
            PermissionError(
                f"User {request.state.app_user_id} is not a moderator but attempted to delete a palette"
            ),
            "delete_not_moderator",
        )
        return {
            "success": False,
            "error": "User is not a moderator",
        }
    return None


@palettes_router.delete("/id/{id}")
async def delete_palette(
    request: RequestWithAuthState,
    id: str,
):
    palette = get_palette_by_id(uuid.UUID(id), request.state.app_user_id)
    if not palette:
        return {"success": False, "error": "Palette not found"}

    validation_error = validate_request(request, palette)
    if validation_error:
        return validation_error

    try:
        palette_id = uuid.UUID(id)
        delete_photo(palette.photo_details)
        delete_photo(palette.og_photo_details)
        delete_palette_by_id(palette_id)

        return {"success": True}

    except Exception as e:
        log_error(e, "delete_palette")
        return {"success": False, "error": "Failed to delete palette"}
