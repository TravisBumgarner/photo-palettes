from io import BytesIO

import requests
from PIL import Image

from algorithms.og import generate_og_image
from consts import ErrorMsg
from database import models
from database.models import PermissionLevel
from database.queries.palettes import get_palettes, update_palette
from middleware.auth import RequestWithAuthState
from routes.shared import (
    BaseErrorResponse,
    BaseSuccessResponse,
)
from services.logger import log_error
from utils.photos import get_photo_path, save_photo

from .admin_router import admin_router

ROUTE_NAME = "/backfill_open_graph_images"


def handle_request():
    for moderation_status in models.ModerationStatus:
        palettes = get_palettes(
            moderation_status, size=10, offset=0
        )  # Should return a list of Palette objects
        for palette in palettes:
            image_path = palette.photo_details
            abs_image_path = get_photo_path(image_path)
            response = requests.get(abs_image_path)
            response.raise_for_status()
            image = Image.open(BytesIO(response.content))
            og_image = generate_og_image(image, [x.hex for x in palette.colors])
            save_photo(og_image.getvalue(), f"{palette.id!s}_og", "webp")
            palette.og_photo_details = f"{palette.id!s}_og.webp"
            update_palette(palette.id, og_photo_details=palette.og_photo_details)
    return True


@admin_router.get(ROUTE_NAME)
def backfill_open_graph_images(
    request: RequestWithAuthState,
):
    if request.state.permission_level < PermissionLevel.ADMIN:
        log_error(
            RuntimeError(ErrorMsg.CANNOT_PERFORM_ACTION),
            ROUTE_NAME,
            app_user_id=request.state.app_user_id,
        )
        return BaseErrorResponse(message=ErrorMsg.CANNOT_PERFORM_ACTION)

    try:
        result = handle_request()
        if result:
            return BaseSuccessResponse()
        else:
            return BaseErrorResponse(message=ErrorMsg.SOMETHING_WENT_WRONG)
    except Exception as error:
        log_error(error, ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.SOMETHING_WENT_WRONG)
