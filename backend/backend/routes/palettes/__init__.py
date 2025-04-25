from fastapi import APIRouter

palettes_router = APIRouter()
from . import create, generate, get_by_id, get_list

# Required to attach routes to router.
