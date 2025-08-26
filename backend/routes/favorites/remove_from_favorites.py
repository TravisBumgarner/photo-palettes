import uuid
from typing import TypedDict

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


class ValidatedRequest(TypedDict):
    app_user_id: uuid.UUID


def validate_request(request: RequestWithAuthState) -> ValidatedRequest:
    if not user_is_authed(request) or request.state.app_user_id is None:
        raise HTTPException(status_code=400, detail="User must be authenticated")
    return {"app_user_id": request.state.app_user_id}


@favorites_router.post("/remove")
async def remove_to_favorites(request: RequestWithAuthState, body: RemoveFromFavoritesRequest):
    validated_request = validate_request(request)

    result = remove_palette_from_favorites(validated_request["app_user_id"], body.palette_id)
    return RemoveFromFavoritesResponse(success=result is not None)
