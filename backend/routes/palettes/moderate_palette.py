import uuid

from pydantic import BaseModel

from database.models import ModerationStatus
from database.queries.palettes import update_palette_moderation_status
from middleware.auth import RequestWithAuthState
from services.logger import log_error
from utils.auth import user_is_moderator

from . import palettes_router


class ModerateRequest(BaseModel):
    palette_id: uuid.UUID
    status: ModerationStatus


def validate_request(request: RequestWithAuthState):
    if not user_is_moderator(request):
        log_error(
            PermissionError(
                f"User {request.state.app_user_id} is not a moderator but attempted to moderate a palette"
            )
        )
        return {
            "success": False,
            "error": "User is not a moderator",
        }


@palettes_router.post("/moderate")
async def moderate(
    request: RequestWithAuthState,
    moderate_request: ModerateRequest,
):
    validation_error = validate_request(request)
    if validation_error:
        return validation_error

    try:
        update_palette_moderation_status(moderate_request.palette_id, moderate_request.status)

        return {"success": True}

    except Exception as e:
        log_error(e)
        return {"success": False, "error": "Failed to moderate palette"}
