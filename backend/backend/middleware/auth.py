import uuid

from fastapi import Request
from fastapi.responses import JSONResponse
from supabase import Client

from backend.config import get_config
from backend.database.models import PermissionLevel
from backend.database.queries.users import get_or_create_app_user
from backend.services.logger import log_error

config = get_config()

# Each tuple is (path, method)
public_routes = {
    ("", "GET"),
    ("/alpha/signup", "POST"),
    ("/feature-requests", "GET"),
}

if not config.is_production:
    public_routes.add(("/docs", "GET"))
    public_routes.add(("/openapi.json", "GET"))


class AuthState:
    auth_id: uuid.UUID
    app_user_id: uuid.UUID
    permission_level: PermissionLevel


class RequestWithAuthState(Request):
    state: AuthState


def create_auth_middleware(supabase: Client):
    async def add_authentication(request: RequestWithAuthState, call_next):
        # Normalize path by removing trailing slash
        path = request.url.path.rstrip("/")
        is_whitelisted = (path, request.method) in public_routes
        is_public_media = path.startswith("/uploads/")
        print("ruda", path, request.method, is_whitelisted)

        if is_whitelisted or is_public_media:
            return await call_next(request)

        if request.method == "OPTIONS":
            return await call_next(request)

        auth_header = request.headers.get("authorization", "")

        token = auth_header.replace("Bearer ", "")

        if not token:
            log_error(Exception("No token provided"))
            return JSONResponse(
                status_code=401,
                content={"error": "Unauthorized", "message": "No token provided"},
            )

        try:
            auth = supabase.auth.get_user(token)
            supabase.postgrest.auth(token)

            auth_user = getattr(auth, "user", None)
            if not auth_user or not getattr(auth_user, "email", None):
                log_error(Exception("User email is missing"))
                return JSONResponse(
                    status_code=401,
                    content={
                        "error": "Unauthorized",
                        "message": "User email is missing",
                    },
                )

            app_user = get_or_create_app_user(
                auth_id=uuid.UUID(auth_user.id),
                email=auth_user.email,
                display_name="foobar",
            )

            request.state.auth_id = uuid.UUID(auth_user.id)
            request.state.app_user_id = app_user.id
            request.state.permission_level = app_user.permission_level

        except Exception as e:
            log_error(e)
            return JSONResponse(
                status_code=401,
                content={
                    "error": "Unauthorized",
                    "message": "Invalid user token",
                    "details": str(e),
                },
            )

        return await call_next(request)

    return add_authentication
