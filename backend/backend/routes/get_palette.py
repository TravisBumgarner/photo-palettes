from fastapi import APIRouter

from backend.database.models import ModerationStatus
from backend.database.queries import get_palette_by_id

router = APIRouter()


@router.get("/palette/{id}")
async def get_palette(id: str):
    palette = get_palette_by_id(id)

    if not palette:
        return {
            "success": False,
            "error": "Palette not found",
        }

    if palette.moderation_status == ModerationStatus.REJECTED:
        return {
            "success": False,
            "error": "Palette rejected",
        }
    print("returning palette", palette)
    return {
        "success": True,
        "palette": palette,
    }
