import io
import os
import uuid

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

    # Read the file content once
    photo_content = await photo.read()

    # Create a BytesIO object for get_image_colors
    photo_bytes = io.BytesIO(photo_content)
    colors = get_image_colors(photo_bytes)

    id = uuid.uuid4()
    filename = f"{id}.{photo.filename.split('.')[-1]}"
    palette = Palette(
        id=id,
        name="",
        user_id=request.state.authDetails_id,
        image_url=filename,
    )

    db.add(palette)
    db.commit()

    # Save the original content using absolute path
    uploads_dir = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads"
    )
    os.makedirs(uploads_dir, exist_ok=True)
    file_path = os.path.join(uploads_dir, filename)
    with open(file_path, "wb") as f:
        f.write(photo_content)

    return {
        "success": True,
        "palette": colors,
        "palette_id": palette.id,
    }
