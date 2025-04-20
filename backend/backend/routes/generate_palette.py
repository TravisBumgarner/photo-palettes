from fastapi import APIRouter, Depends, File, HTTPException, Request, UploadFile
from sqlalchemy.orm import Session

from backend.algorithms.kmeans import get_image_colors
from backend.database.deps import get_db
from backend.database.models import Palette

router = APIRouter()


def validate_request(photo: UploadFile = File(...)):
    if photo.content_type not in ["image/png", "image/jpeg", "image/jpg"]:
        raise HTTPException(status_code=400, detail="Invalid file type")


@router.post("/generate-palette")
async def generate_palette(
    request: Request, photo: UploadFile = File(...), db: Session = Depends(get_db)
):
    validate_request(photo)

    colors = get_image_colors(photo)

    palette = Palette(
        name="",
        user_id=request.state.user_id,
        image_url=photo.filename,
    )
    db.add(palette)
    db.commit()

    return {
        "success": True,
        "palette": colors,
        "palette_id": palette.id,
    }
