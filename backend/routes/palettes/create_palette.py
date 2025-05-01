import uuid
from typing import List

from fastapi import HTTPException
from pydantic import BaseModel

from database.models import ModerationStatus, Palette, PaletteColor
from database.queries.palettes import get_palette_by_id, update_palette
from middleware.auth import RequestWithAuthState
from services.logger import log_error
from services.pushover import send_pushover_notification
from utils.auth import user_is_moderator
from utils.colors import hex_to_rgb

from . import palettes_router


class PaletteRequest(BaseModel):
    name: str
    hex_colors: List[str]
    palette_id: str


def validate_request(request: RequestWithAuthState, palette: Palette):
    if not (user_is_moderator(request) or request.state.app_user_id == palette.app_user_id):
        raise HTTPException(status_code=400, detail="User does not own resource")


@palettes_router.post("/create")
async def create(
    request: RequestWithAuthState,
    palette_request: PaletteRequest,
):
    try:
        palette = get_palette_by_id(uuid.UUID(palette_request.palette_id))

        if not palette:
            return {
                "success": False,
                "error": "No palette found",
            }

        validation_error = validate_request(request, palette)
        if validation_error:
            return validation_error

        colors = []
        for hex_color in palette_request.hex_colors:
            r, g, b = hex_to_rgb(hex_color)
            colors.append(
                PaletteColor(
                    hex=hex_color,
                    r=r,
                    g=g,
                    b=b,
                    rgb_cube=f"({r},{g},{b})",
                    palette_id=palette.id,
                )
            )

        update_palette(
            palette.id,
            name=palette_request.name,
            moderation_status=ModerationStatus.AWAITING_MODERATION,
            colors=colors,
        )

        send_pushover_notification(f"New palette submitted: {palette_request.name}")
        return {
            "success": True,
            "paletteId": palette.id,
        }

    except Exception as e:
        log_error(e)
        return {
            "success": False,
            "error": "Failed to create palette",
        }
