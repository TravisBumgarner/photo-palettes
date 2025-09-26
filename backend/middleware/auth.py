import uuid

from common.models import PermissionLevel
from fastapi import Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from supabase import Client

from config import get_config
from database.queries.users import get_or_create_app_user
from services.logger import log_error

config = get_config()


class AuthState:
    auth_id: uuid.UUID | None
    app_user_id: uuid.UUID | None
    permission_level: PermissionLevel


class RequestWithAuthState(Request):
    # I'll deal with this later. For now, I get proper type checking in my IDE.
    state: AuthState  # type: ignore


def get_auth_user(supabase: Client, token: str):
    if not token or token == "undefined":
        return None

    auth = supabase.auth.get_user(token)

    if not auth or not auth.user:
        return None

    supabase.postgrest.auth(token)
    return auth.user


class AppUserDetails(BaseModel):
    app_user_id: uuid.UUID
    permission_level: PermissionLevel


def get_app_user_details(auth_user):
    app_user = get_or_create_app_user(
        auth_id=uuid.UUID(auth_user.id),
        email=auth_user.email,
    )

    return AppUserDetails(
        app_user_id=app_user.id,
        permission_level=app_user.permission_level,
    )


def create_auth_middleware(supabase: Client):
    async def add_authentication(request: RequestWithAuthState, call_next):
        if request.method == "OPTIONS":
            return await call_next(request)

        if request.url.path.startswith("/docs"):
            if config.is_production:
                return JSONResponse(
                    status_code=401,
                    content={"error": "Unauthorized", "message": "No access"},
                )
            request.state.auth_id = None
            request.state.app_user_id = None
            request.state.permission_level = PermissionLevel.Anonymous
            return await call_next(request)

        auth_header = request.headers.get("authorization", "")

        # Cannot figure where undefined is coming from.
        token = auth_header.replace("Bearer ", "").replace("undefined", "")

        if not token:
            request.state.auth_id = None
            request.state.app_user_id = None
            request.state.permission_level = PermissionLevel.Anonymous
            return await call_next(request)

        auth_user = get_auth_user(supabase, token)
        if token and not auth_user:
            log_error(
                RuntimeError("User supplied an invalid token. Attack?"),
                "auth_middleware",
            )
            return JSONResponse(
                status_code=401,
                content={"error": "Unauthorized", "message": "Invalid token"},
            )

        user_details = get_app_user_details(auth_user)
        if not user_details:
            log_error(
                RuntimeError("Failed to get app user."),
                "auth_middleware",
            )
            return JSONResponse(
                status_code=500,
                content={"error": "Internal Server Error", "message": "User error"},
            )

        request.state.auth_id = uuid.UUID(auth_user.id) if auth_user and auth_user.id else None
        request.state.app_user_id = user_details.app_user_id
        request.state.permission_level = user_details.permission_level

        return await call_next(request)

    return add_authentication
