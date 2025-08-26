import uuid

from pydantic import BaseModel

from consts import ERROR_MSG
from database.queries.favorites import add_palette_to_favorites
from middleware.auth import RequestWithAuthState
from services.logger import log_error
from utils.auth import user_is_authed

from . import favorites_router


class Body(BaseModel):
    palette_id: uuid.UUID


class Response(BaseModel):
    success: bool
    message: str | None = None


class ValidRequest(BaseModel):
    app_user_id: uuid.UUID


class InvalidRequest(BaseModel):
    error: str


def parse_request(raw_request: RequestWithAuthState):
    if not user_is_authed(raw_request):
        return InvalidRequest(error=ERROR_MSG.USER_NOT_AUTHENTICATED)

    return ValidRequest(success=True, app_user_id=raw_request.state.app_user_id)


@favorites_router.post("/add")
async def add_to_favorites(raw_request: RequestWithAuthState, body: Body):
    try:
        parsed_request = parse_request(raw_request)

        match parsed_request:
            case InvalidRequest(error=error):
                log_error(RuntimeError(error), "add_to_favorites_invalid")
                return Response(success=False, message=error)
            case ValidRequest(app_user_id=app_user_id):
                result = add_palette_to_favorites(app_user_id, body.palette_id)
                return Response(success=result)
    except Exception as e:
        log_error(e, "add_to_favorites")
        return Response(success=False, message=ERROR_MSG.SOMETHING_WENT_WRONG)
