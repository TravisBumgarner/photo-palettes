import uuid

from fastapi import HTTPException
from pydantic import BaseModel

from backend.database.models import ModerationStatus
from backend.database.queries.palettes import update_palette_moderation_status
from backend.middleware.auth import RequestWithAuthState
from backend.utils.auth import user_is_moderator
from backend.utils.logging import log_error

from . import palettes_router


class ModerateRequest(BaseModel):
    palette_id: uuid.UUID
    status: ModerationStatus


def validate_request(request: RequestWithAuthState):
    if not user_is_moderator(request):
        log_error(
            PermissionError(
                f"User {request.user.id} is not a moderator but attempted to moderate a palette"
            )
        )
        raise HTTPException(status_code=400, detail="User is not a moderator")


@palettes_router.post("/moderate")
async def moderate(
    request: RequestWithAuthState,
    moderate_request: ModerateRequest,
):
    validate_request(request)

    update_palette_moderation_status(moderate_request.palette_id, moderate_request.status)

    return {"success": True}
