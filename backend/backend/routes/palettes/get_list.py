from backend.database.queries.palettes import get_moderated_palettes
from backend.middleware.auth import RequestWithAuthState

from . import palettes_router


@palettes_router.get("/")
async def get_palettes(request: RequestWithAuthState):
    palettes = get_moderated_palettes()
    return palettes
