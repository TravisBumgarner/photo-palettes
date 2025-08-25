from fastapi import APIRouter

favorites_router = APIRouter()

# Required to attach routes to router.
from . import add_to_favorites, remove_from_favorites
