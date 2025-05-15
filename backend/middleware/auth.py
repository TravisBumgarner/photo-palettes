import re
import uuid

from fastapi import Request
from fastapi.responses import JSONResponse
from supabase import Client

from config import get_config
from database.models import PermissionLevel
from database.queries.users import get_or_create_app_user
from services.logger import log_error

config = get_config()

# Each tuple is (pattern, method)
public_routes = [
    (re.compile(r"^/$"), "GET"),
    (re.compile(r"^/alpha/signup$"), "POST"),
    (re.compile(r"^/feature_requests/$"), "GET"),
    (re.compile(r"^/palettes/app_user_id/\w+$"), "GET"),
    (re.compile(r"^/palettes$"), "GET"),
    (re.compile(r"^/palettes/id/.*$"), "GET"),
    (re.compile(r"^/uploads/.*\.(jpg|jpeg|png|webp)$"), "GET"),
]

if not config.is_production:
    public_routes.append((re.compile(r"^/docs$"), "GET"))
    public_routes.append((re.compile(r"^/openapi\.json$"), "GET"))


class AuthState:
    auth_id: uuid.UUID | None
    app_user_id: uuid.UUID | None
    permission_level: PermissionLevel | None


class RequestWithAuthState(Request):
    state: AuthState


def get_auth_user(supabase: Client, token: str):
    if not token or token == "undefined":
        return None

    auth = supabase.auth.get_user(token)

    if not auth or not auth.user:
        return None

    supabase.postgrest.auth(token)
    return auth.user


def get_app_user_details(auth_user):
    app_user = get_or_create_app_user(
        auth_id=uuid.UUID(auth_user.id),
        email=auth_user.email,
    )

    return {
        "app_user_id": app_user.id,
        "permission_level": app_user.permission_level,
    }


def create_auth_middleware(supabase: Client):
    async def add_authentication(request: RequestWithAuthState, call_next):
        path = request.url.path
        route_requires_auth = not any(
            pattern.match(path) and method == request.method for pattern, method in public_routes
        )

        if request.method == "OPTIONS":
            return await call_next(request)

        auth_header = request.headers.get("authorization", "")
        token = auth_header.replace("Bearer ", "")

        if not token and route_requires_auth:
            log_error(Exception("No token provided"), "not_token")
            return JSONResponse(
                status_code=401,
                content={"error": "Unauthorized", "message": "No token provided"},
            )

        try:
            auth_user = get_auth_user(supabase, token)
        except Exception as e:
            log_error(e, "get_auth_user")
            return JSONResponse(
                status_code=401,
                content={"error": "Unauthorized", "message": "Something went wrong"},
            )

        try:
            if not auth_user:
                request.state.auth_id = None
                request.state.app_user_id = None
                request.state.permission_level = None
            else:
                request.state.auth_id = uuid.UUID(auth_user.id)
                user_details = get_app_user_details(auth_user)
                request.state.app_user_id = user_details["app_user_id"]
                request.state.permission_level = user_details["permission_level"]
        except Exception as e:
            log_error(e, "auth_middleware")
            request.state.auth_id = None
            request.state.app_user_id = None
            request.state.permission_level = None

        return await call_next(request)

    return add_authentication
