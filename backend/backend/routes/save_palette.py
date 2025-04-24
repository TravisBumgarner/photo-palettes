import uuid
from typing import List

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field, field_validator

from backend.database.models import ModerationStatus, Palette, PaletteColor
from backend.database.queries import get_palette_by_id, update_palette
from backend.middleware.auth import RequestWithAuthState
from backend.utils.logger import log_error
from backend.utils.pushover import send_notification

router = APIRouter()


class PaletteRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    hex_colors: List[str] = Field(..., min_length=1, max_length=6)
    palette_id: str = Field(..., min_length=1)

    @field_validator("hex_colors")
    def validate_hex_colors(cls, v):
        if len(v) != len(set(v)):
            raise ValueError("Duplicate hex colors")
        for hex_color in v:
            try:
                hex_to_rgb(hex_color)
            except ValueError as e:
                raise ValueError(f"Invalid hex color: {hex_color}") from e
        return v


def hex_to_rgb(hex_str: str) -> tuple[int, int, int]:
    hex_str = hex_str.lstrip("#")
    return (int(hex_str[0:2], 16), int(hex_str[2:4], 16), int(hex_str[4:6], 16))


def validate_request(request: RequestWithAuthState, palette: Palette):
    if not palette.app_user_id == request.state.app_user_id:
        raise HTTPException(status_code=400, detail="User does not own resource")


@router.post("/save-palette")
async def save_palette(
    request: RequestWithAuthState,
    palette_request: PaletteRequest,
):
    try:
        palette = get_palette_by_id(uuid.UUID(palette_request.palette_id))

        if not palette:
            raise HTTPException(status_code=400, detail="No palette found")

        validate_request(request, palette)

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

        send_notification(f"New palette submitted: {palette_request.name}")
        return {
            "success": True,
            "palette_id": palette.id,
        }

    except Exception as e:
        log_error(e)
        raise HTTPException(status_code=500, detail=str(e)) from e
