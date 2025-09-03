from io import BytesIO

import requests
from PIL import Image

from algorithms.og import generate_og_image
from consts import ErrorMsg
from database import models
from database.queries.palettes import get_palettes, update_palette
from middleware.auth import RequestWithAuthState
from routes.shared import AuthedRequest, BaseErrorResponse, BaseSuccessResponse, InvalidRequest
from services.logger import log_error
from utils.auth import get_admin_auth
from utils.photos import save_photo

from .admin_router import admin_router

ROUTE_NAME = "/backfill_open_graph_images"


def parse_request(raw_request: RequestWithAuthState) -> AuthedRequest | InvalidRequest:
    admin_auth = get_admin_auth(raw_request)
    if not admin_auth:
        return InvalidRequest(error=ErrorMsg.CANNOT_PERFORM_ACTION)

    return AuthedRequest(app_user_id=admin_auth.app_user_id, auth_id=admin_auth.auth_id)


def handle_request():
    for moderation_status in models.ModerationStatus:
        palettes = get_palettes(
            moderation_status, size=10, offset=0
        )  # Should return a list of Palette objects
        for palette in palettes:
            image_path = palette.photo_details
            abs_image_path = (
                image_path
                if image_path.startswith("https://")
                else f"http://localhost:8000{image_path}"
            )
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
    raw_request: RequestWithAuthState,
):
    parsed_request = parse_request(raw_request)
    try:
        match parsed_request:
            case InvalidRequest(error=error):
                log_error(
                    RuntimeError(error), ROUTE_NAME, app_user_id=raw_request.state.app_user_id
                )
                return BaseErrorResponse(message=error)
            case AuthedRequest(app_user_id=_app_user_id):
                result = handle_request()
                if result:
                    return BaseSuccessResponse()
                else:
                    return BaseErrorResponse(message=ErrorMsg.SOMETHING_WENT_WRONG)
    except Exception as error:
        log_error(error, ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.SOMETHING_WENT_WRONG)
