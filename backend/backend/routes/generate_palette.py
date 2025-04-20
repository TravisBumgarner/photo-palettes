import logging
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, UploadFile
from PIL import Image
from sqlalchemy.orm import Session

from backend.algorithms.kmeans import get_photo_colors
from backend.database.deps import get_db
from backend.database.models import Palette
from backend.sync_params import sync_params

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter()


def validate_request(photo: UploadFile = File(...)):
    logger.debug(
        f"Validating request: {photo.filename}, content_type: {photo.content_type}"
    )
    if photo.content_type not in sync_params.supported_image_types:
        logger.error(f"Invalid file type: {photo.content_type}")
        raise HTTPException(status_code=400, detail="Invalid file type")
    logger.debug("Request validation successful")


@router.post("/generate-palette")
async def generate_palette(
    request: Request,
    photo: UploadFile = File(...),
    name: Optional[str] = Form(None),
    db: Session = Depends(get_db),
):
    logger.debug(f"Generating palette for: {photo.filename}, name: {name}")
    validate_request(photo)

    try:
        colors = get_photo_colors(photo)
        logger.debug(f"Generated {len(colors)} colors")
    except Exception as e:
        logger.error(f"Error generating palette: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500, detail=f"Error generating palette: {str(e)}"
        )

    palette = Palette(
        name=name or "",
        user_id=request.state.user_id,
        image_url=photo.filename,
    )
    db.add(palette)
    db.commit()
    logger.debug(f"Saved palette with ID: {palette.id}")

    return {
        "success": True,
        "palette": colors,
        "palette_id": palette.id,
    }
