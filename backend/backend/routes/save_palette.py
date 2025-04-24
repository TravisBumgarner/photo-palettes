from typing import List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field, field_validator
from sqlalchemy.orm import Session

from backend.database.deps import get_db
from backend.database.models import PaletteColor
from backend.database.queries import get_palette_by_id
from backend.middleware.auth import RequestWithAuthState
from backend.utils.auth import user_owns_resource
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


def validate_request(request: RequestWithAuthState, palette_request: PaletteRequest):
    if not user_owns_resource(request, palette_request):
        raise HTTPException(status_code=400, detail="User does not own resource")


@router.post("/save-palette")
async def save_palette(
    request: RequestWithAuthState,
    palette_request: PaletteRequest,
    db: Session = Depends(get_db),
):
    try:
        palette = get_palette_by_id(palette_request.palette_id)

        if not palette:
            raise HTTPException(status_code=400, detail="No palette found")

        palette.name = palette_request.name

        # Add new colors
        for hex_color in palette_request.hex_colors:
            r, g, b = hex_to_rgb(hex_color)
            new_color = PaletteColor(
                hex=hex_color,
                r=r,
                g=g,
                b=b,
                rgb_cube=f"({r},{g},{b})",
                palette_id=palette.id,
            )
            db.add(new_color)

        db.commit()
        send_notification(f"New palette submitted: {palette_request.name}")
        return {
            "success": True,
            "palette_id": palette.id,
        }

    except Exception as e:
        log_error(e)
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e)) from e
