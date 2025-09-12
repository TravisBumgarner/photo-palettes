import uuid

from pydantic import BaseModel

from consts import ErrorMsg
from database.models import ModerationStatus, PermissionLevel
from database.queries.palettes import PaletteUpdate, get_palette_by_id, update_palette
from middleware.auth import RequestWithAuthState
from routes.shared import (
    BaseErrorResponse,
    BaseSuccessResponse,
)
from services.bsky import post_to_bsky
from services.instagram import post_to_instagram
from services.logger import log_error

from .palettes_router import palettes_router


class Body(BaseModel):
    palette_id: uuid.UUID
    status: ModerationStatus
    share_to_socials: bool = False


ROUTE_NAME = "moderate_palette"


def handle_request(
    palette_id: uuid.UUID, status: ModerationStatus, share_to_socials: bool
):
    palette_update = PaletteUpdate(moderation_status=status)
    update_palette(palette_id, palette_update)

    if status == ModerationStatus.APPROVED and share_to_socials:
        palette = get_palette_by_id(palette_id)
        if not palette:
            raise RuntimeError("Palette not found after update")

        # post_to_bsky(
        #     title=palette.name,
        #     colors=" ".join([c.hex for c in palette.colors]),
        #     image_path=palette.og_photo_details,
        #     image_alt=f"{palette.name} - Colors: {' '.join([c.hex for c in palette.colors])}",
        #     author_id=str(palette.app_user_id),
        #     palette_id=str(palette.id),
        # )

        post_to_instagram(
            photo=palette.og_photo_details,
            colors=[c.hex for c in palette.colors],
            description=f"{palette.name} - Colors: {' '.join([c.hex for c in palette.colors])}",
        )

    return BaseSuccessResponse()


@palettes_router.post("/moderate")
async def moderate(
    request: RequestWithAuthState,
    body: Body,
):
    if request.state.permission_level < PermissionLevel.MODERATOR:
        log_error(
            RuntimeError(ErrorMsg.CANNOT_PERFORM_ACTION),
            ROUTE_NAME,
            app_user_id=request.state.app_user_id,
        )
        return BaseErrorResponse(message=ErrorMsg.CANNOT_PERFORM_ACTION)

    try:
        return handle_request(body.palette_id, body.status, body.share_to_socials)
    except Exception as error:
        log_error(error, ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.SOMETHING_WENT_WRONG)
