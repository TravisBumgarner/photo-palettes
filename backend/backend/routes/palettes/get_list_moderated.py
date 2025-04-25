from backend.database.queries.palettes import get_moderated_palettes
from backend.middleware.auth import RequestWithAuthState
from backend.services.logger import log_error
from backend.utils.photos import get_photo_path

from . import palettes_router
from .response_models import PaletteColorResponse, PaletteResponse


@palettes_router.get("/")
async def get_list_moderated(request: RequestWithAuthState):
    try:
        palettes = get_moderated_palettes()

    except Exception as error:
        log_error(error)
        return {
            "success": False,
            "error": "Failed to get moderated palettes",
        }

    return {
        "success": True,
        "palettes": [
            PaletteResponse(
                id=palette.id,
                name=palette.name,
                created_at=palette.created_at,
                photo_url=get_photo_path(palette.photo_details),
                colors=[
                    PaletteColorResponse(
                        id=color.id,
                        hex=color.hex,
                        r=color.r,
                        g=color.g,
                        b=color.b,
                    )
                    for color in palette.colors
                ],
                moderation_status=palette.moderation_status,
            )
            for palette in palettes
        ],
    }
