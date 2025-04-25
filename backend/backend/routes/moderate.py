import uuid

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.database.models import ModerationStatus
from backend.database.queries.palettes import update_palette_moderation_status
from backend.middleware.auth import RequestWithAuthState
from backend.utils.auth import user_is_moderator

router = APIRouter()


class ModerateRequest(BaseModel):
    palette_id: uuid.UUID
    status: ModerationStatus


def validate_request(request: RequestWithAuthState):
    print("ruda", request.state.permission_level)
    if not user_is_moderator(request):
        raise HTTPException(status_code=400, detail="User is not a moderator")


@router.post("/moderate")
async def moderate(
    request: RequestWithAuthState,
    moderate_request: ModerateRequest,
):
    print("ruda request is called")
    validate_request(request)

    update_palette_moderation_status(moderate_request.palette_id, moderate_request.status)

    return {"success": True}
