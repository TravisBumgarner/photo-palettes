from fastapi import Request
from fastapi.responses import JSONResponse
from supabase import Client

from backend.database.queries import get_or_create_app_user
from backend.utils.logger import log_error

# Added from main.py
public_routes = {"/"}


class AuthState:
    auth_id: str
    app_user_id: str


class RequestWithAuthState(Request):
    state: AuthState


def create_auth_middleware(supabase: Client):
    async def add_authentication(request: RequestWithAuthState, call_next):
        is_whitelisted = request.url.path in public_routes
        is_public_media = request.url.path.startswith("/uploads/")

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
                auth_id=auth_user.id,
                email=auth_user.email,
                display_name="foobar",
            )

            request.state.auth_id = str(auth_user.id)
            request.state.app_user_id = str(app_user.id)

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
