from fastapi import APIRouter, HTTPException

from backend.database.queries import get_unmoderated_palettes
from backend.middleware.auth import RequestWithAuthState
from backend.utils.auth import user_is_admin, user_is_moderator

router = APIRouter()


def validate_request(request: RequestWithAuthState):
    if not (user_is_admin(request) or user_is_moderator(request)):
        raise HTTPException(status_code=400, detail="User does not own resource")


@router.get("/moderation")
def get_palettes():
    palettes = get_unmoderated_palettes()
    return {
        "success": True,
        "palettes": [
            {
                "moderation_status": palette.moderation_status,
                "id": palette.id,
                "name": palette.name,
                "image_url": palette.image_url,
                "created_at": palette.created_at.isoformat(),
                "colors": [
                    {
                        "id": color.id,
                        "hex": color.hex,
                        "r": color.r,
                        "g": color.g,
                        "b": color.b,
                    }
                    for color in palette.colors
                ],
            }
            for palette in palettes
        ],
    }
