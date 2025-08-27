import uuid

from pydantic import BaseModel

from consts import ERROR_MSG
from database.queries.favorites import remove_palette_from_favorites
from middleware.auth import RequestWithAuthState
from routes.shared import AuthedRequest, InvalidRequest
from services.logger import log_error
from utils.auth import user_is_authed

from . import favorites_router


class Body(BaseModel):
    palette_id: uuid.UUID


class Response(BaseModel):
    success: bool
    message: str | None = None


# Discriminated union for request validation
def parse_request(raw_request: RequestWithAuthState) -> AuthedRequest | InvalidRequest:
    if not user_is_authed(raw_request):
        return InvalidRequest(error=ERROR_MSG.USER_NOT_AUTHENTICATED)

    return AuthedRequest(
        app_user_id=raw_request.state.app_user_id, auth_id=raw_request.state.auth_id
    )


@favorites_router.post("/remove")
async def remove_to_favorites(raw_request: RequestWithAuthState, body: Body):
    try:
        parsed_request = parse_request(raw_request)

        match parsed_request:
            case InvalidRequest(error=error):
                log_error(RuntimeError(error), "remove_from_favorites_invalid")
                return Response(success=False, message=error)
            case AuthedRequest(app_user_id=app_user_id):
                result = remove_palette_from_favorites(app_user_id, body.palette_id)
                return Response(success=result)

    except Exception as e:
        log_error(e, "remove_from_favorites")
        return Response(success=False, message=ERROR_MSG.SOMETHING_WENT_WRONG)
