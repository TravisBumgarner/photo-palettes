import uuid

from fastapi import HTTPException
from pydantic import BaseModel

from database.queries.favorites import add_palette_to_favorites
from middleware.auth import RequestWithAuthState
from utils.auth import user_is_authed

from . import favorites_router


class AddToFavoritesRequest(BaseModel):
    palette_id: uuid.UUID


class AddToFavoritesResponse(BaseModel):
    success: bool
    message: str | None = None


def validate_request(request: RequestWithAuthState):
    if not user_is_authed(request):
        raise HTTPException(status_code=400, detail="User must be authenticated")


@favorites_router.post("/add")
async def add_to_favorites(request: RequestWithAuthState, body: AddToFavoritesRequest):
    validate_request(request)

    if request.state.app_user_id is None:
        # Cheap way to get type validation on call to add_palette_to_favorites
        return

    result = add_palette_to_favorites(request.state.app_user_id, body.palette_id)
    return AddToFavoritesResponse(success=result is not None)
