from fastapi import APIRouter

palettes_router = APIRouter()

# Required to attach routes to router.
from . import (
    create,
    generate,
    get_by_id,
    get_list_as_moderator,
    get_list_moderated,
    moderate,
)
