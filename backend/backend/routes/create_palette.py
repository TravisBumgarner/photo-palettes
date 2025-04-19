from fastapi import APIRouter, File, HTTPException, UploadFile
from PIL import Image

from backend.algorithms.kmeans import get_image_colors
from backend.sync_params import sync_params

router = APIRouter()


def validate_request(photo: UploadFile = File(...)):
    if photo.content_type not in sync_params.supported_image_types:
        raise HTTPException(status_code=400, detail="Invalid file type")


@router.post("/create-palette")
async def create_palette(photo: UploadFile = File(...)):
    validate_request(photo)

    colors = get_image_colors(photo)
    print(colors)
    return {
        "success": True,
        "palette": colors,
    }
