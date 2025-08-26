from fastapi import APIRouter

favorites_router = APIRouter()

# Required to attach routes to router.
from . import add_to_favorites, get_palette_favorites_list, remove_from_favorites
