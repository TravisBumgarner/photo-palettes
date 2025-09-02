import uuid

from pydantic import BaseModel

from consts import ERROR_MSG
from database.models import ModerationStatus, Palette, PaletteColor
from database.queries.palettes import get_palette_by_id, update_palette
from middleware.auth import RequestWithAuthState
from routes.shared import AuthedRequest, BaseErrorResponse, BaseSuccessResponse, InvalidRequest
from services.logger import log_error
from services.pushover import send_pushover_notification
from utils.auth import get_user_auth, user_owns_resource
from utils.colors import hex_to_rgb

from . import palettes_router

ROUTE_NAME = "create_palette"


class Body(BaseModel):
    name: str
    hex_colors: list[str]
    palette_id: str


def parse_request(
    raw_request: RequestWithAuthState, palette: Palette | None
) -> tuple[AuthedRequest, Palette] | InvalidRequest:
    user_auth = get_user_auth(raw_request)

    if not user_auth:
        return InvalidRequest(error=ERROR_MSG.CANNOT_PERFORM_ACTION)

    if not palette:
        return InvalidRequest(error=ERROR_MSG.RESOURCE_NOT_FOUND)

    if not user_owns_resource(raw_request, palette):
        return InvalidRequest(error=ERROR_MSG.USER_DOES_NOT_OWN_RESOURCE)

    return (
        AuthedRequest(app_user_id=user_auth["app_user_id"], auth_id=user_auth["auth_id"]),
        palette,
    )


class SuccessResponse(BaseSuccessResponse):
    paletteId: uuid.UUID  # noqa #815


@palettes_router.post("/create")
async def create(
    raw_request: RequestWithAuthState,
    body: Body,
):
    try:
        raw_palette = get_palette_by_id(uuid.UUID(body.palette_id), raw_request.state.app_user_id)
        [parsed_request, palette] = parse_request(raw_request, raw_palette)

        match parsed_request:
            case InvalidRequest(error=error):
                log_error(RuntimeError(error), ROUTE_NAME)
                return BaseErrorResponse(message=error)
            case AuthedRequest(app_user_id=_app_user_id):
                colors = []
                for hex_color in body.hex_colors:
                    r, g, b = hex_to_rgb(hex_color)
                    colors.append(
                        PaletteColor(
                            hex=hex_color,
                            r=r,
                            g=g,
                            b=b,
                            rgb_cube=f"({r},{g},{b})",
                            palette_id=palette.id,
                        )
                    )

                update_palette(
                    palette_id=palette.id,
                    name=body.name,
                    moderation_status=ModerationStatus.AWAITING_MODERATION,
                    colors=colors,
                )

                send_pushover_notification(f"New palette submitted: {body.name}")
                return SuccessResponse(
                    paletteId=palette.id,
                )

    except Exception as e:
        log_error(e, ROUTE_NAME)
        return BaseErrorResponse(message=ERROR_MSG.SOMETHING_WENT_WRONG)
