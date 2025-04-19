from fastapi import APIRouter, File, HTTPException, UploadFile

from backend.params import sync_params

# from PIL import Image

router = APIRouter()


def validate_request(photo: UploadFile = File(...)):
    if photo.content_type not in sync_params.supported_image_types:
        raise HTTPException(status_code=400, detail="Invalid file type")


@router.post("/create-palette")
async def create_palette(photo: UploadFile = File(...)):
    validate_request(photo)

    # image = Image.open(photo.file)
    # image.convert("RGB")
    # image.save("temp.png")

    return {
        "success": True,
        "palette": [
            {"color": "#000000", "percent_location": (10, 10)},
            {"color": "#EEEEEE", "percent_location": (20, 20)},
            {"color": "#FFFFFF", "percent_location": (30, 30)},
            {"color": "#AAA", "percent_location": (40, 40)},
            {"color": "#DDD", "percent_location": (50, 50)},
            {"color": "#CCC", "percent_location": (60, 60)},
        ],
    }
