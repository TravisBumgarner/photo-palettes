from fastapi import APIRouter

palettes_router = APIRouter()

# Required to attach routes to router.
from . import (
    create_palette,
    generate_palette,
    get_og_url,
    get_palette_by_id,
    get_palette_list_as_moderator,
    get_palette_list_by_app_user_id,
    get_palette_list_moderated,
    moderate_palette,
)
