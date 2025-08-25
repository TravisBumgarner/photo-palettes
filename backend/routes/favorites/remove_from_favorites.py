import uuid

from fastapi import HTTPException
from pydantic import BaseModel

from database.queries.favorites import remove_palette_from_favorites
from middleware.auth import RequestWithAuthState
from utils.auth import user_is_authed

from . import favorites_router


class RemoveFromFavoritesRequest(BaseModel):
    palette_id: uuid.UUID


class RemoveFromFavoritesResponse(BaseModel):
    success: bool
    message: str | None = None


def validate_request(request: RequestWithAuthState):
    if not user_is_authed(request):
        raise HTTPException(status_code=400, detail="User must be authenticated")


@favorites_router.post("/remove")
async def fremove_to_favorites(request: RequestWithAuthState, body: RemoveFromFavoritesRequest):
    validate_request(request)

    if request.state.app_user_id is None:
        # Cheap way to get type validation on call to add_palette_to_favorites
        return

    result = remove_palette_from_favorites(request.state.app_user_id, body.palette_id)
    return RemoveFromFavoritesResponse(success=result is not None)
