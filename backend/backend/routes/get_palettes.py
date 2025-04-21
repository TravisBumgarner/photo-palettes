from fastapi import APIRouter

from backend.database.queries import get_all_palettes

router = APIRouter()


@router.get("/get-palettes")
def get_palettes():
    palettes = get_all_palettes()
    return {
        "success": True,
        "palettes": [
            {
                "id": palette.id,
                "name": palette.name,
                "image_url": palette.image_url,
                "created_at": palette.created_at.isoformat(),
                "colors": [
                    {
                        "id": color.id,
                        "hex": color.hex,
                        "r": color.r,
                        "g": color.g,
                        "b": color.b,
                    }
                    for color in palette.colors
                ],
            }
            for palette in palettes
        ],
    }
