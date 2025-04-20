from fastapi import Request
from fastapi.responses import JSONResponse
from supabase import Client

from backend.database.queries import get_or_create_user
from backend.utils.logger import log_error

# Added from main.py
public_routes = {"/"}


def create_auth_middleware(supabase: Client):
    async def add_authentication(request: Request, call_next):

        if request.url.path in public_routes:
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

            user_info = getattr(auth, "user", None)
            if not user_info or not getattr(user_info, "email", None):
                log_error(Exception("User email is missing"))
                return JSONResponse(
                    status_code=401,
                    content={
                        "error": "Unauthorized",
                        "message": "User email is missing",
                    },
                )

            user = get_or_create_user(
                auth_id=user_info.id,
                email=user_info.email,
                display_name="foobar",
            )

            request.state.auth_id = user_info.id
            request.state.user_id = user.id

            print("setting", request.state)
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
