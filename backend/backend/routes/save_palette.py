from typing import List

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field, validator
from sqlalchemy.orm import Session

from backend.database.deps import get_db
from backend.database.models import Palette, PaletteColor
from backend.database.queries import get_palette_by_id

router = APIRouter()


class PaletteRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    hex_colors: List[str] = Field(..., min_length=1, max_length=6)
    palette_id: str = Field(..., min_length=1)

    @validator("hex_colors")
    def validate_hex_colors(cls, v):
        if len(v) != len(set(v)):
            raise ValueError("Duplicate hex colors")
        for hex_color in v:
            try:
                hex_to_rgb(hex_color)
            except ValueError:
                raise ValueError(f"Invalid hex color: {hex_color}")
        return v


def hex_to_rgb(hex_str: str) -> tuple[int, int, int]:
    hex_str = hex_str.lstrip("#")
    if len(hex_str) != 6:
        raise ValueError("Invalid hex color")
    r = int(hex_str[0:2], 16)
    g = int(hex_str[2:4], 16)
    b = int(hex_str[4:6], 16)
    return (r, g, b)


def validate_request(request: Request, palette_request: PaletteRequest):
    palette = get_palette_by_id(palette_request.palette_id)
    if not palette:
        raise HTTPException(status_code=400, detail="No palette found")

    if palette.user_id != request.state.user_id:
        raise HTTPException(status_code=400, detail="Not authorized")

    return


@router.post("/save-palette")
async def save_palette(
    request: Request, palette_request: PaletteRequest, db: Session = Depends(get_db)
):
    validate_request(request, palette_request)

    try:
        palette = (
            db.query(Palette)
            .filter(Palette.user_id == request.state.user_id)
            .filter(Palette.id == palette_request.palette_id)
            .first()
        )
        if not palette:
            raise HTTPException(status_code=400, detail="No palette found")

        palette.name = palette_request.name

        for hex_color in palette_request.hex_colors:
            r, g, b = hex_to_rgb(hex_color)
            palette.colors.append(
                PaletteColor(
                    hex=hex_color,
                    r=r,
                    g=g,
                    b=b,
                    rgb_cube=f"({r},{g},{b})",
                    palette_id=palette.id,
                )
            )

        db.commit()
        return {
            "success": True,
            "palette_id": palette.id,
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
