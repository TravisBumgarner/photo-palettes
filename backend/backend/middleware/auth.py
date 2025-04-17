import logging

from fastapi import Request
from fastapi.responses import JSONResponse
from supabase import Client

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


def create_auth_middleware(supabase: Client):
    async def add_authentication(request: Request, call_next):
        # Whitelist of routes that don't need auth
        public_routes = {"/"}

        if request.url.path in public_routes:
            return await call_next(request)

        if request.method == "OPTIONS":
            return await call_next(request)

        auth_header = request.headers.get("authorization", "")
        logger.debug(f"Auth header: {auth_header}")

        token = auth_header.replace("Bearer ", "")
        logger.debug(f"Token: {token}")

        if not token:
            return JSONResponse(
                status_code=401,
                content={"error": "Unauthorized", "message": "No token provided"},
            )

        try:
            auth = supabase.auth.get_user(token)
            request.state.user = auth.user
            request.state.user_id = auth.user.id
            supabase.postgrest.auth(token)
            logger.debug(f"Auth successful for user: {auth.user.email}")

        except Exception as e:
            logger.error(f"Auth error: {str(e)}")
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
