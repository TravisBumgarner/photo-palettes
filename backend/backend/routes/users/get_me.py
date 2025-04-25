from backend.database.queries.users import get_app_user_by_auth_id
from backend.middleware.auth import RequestWithAuthState
from backend.services.logger import log_error

from . import users_router


@users_router.get("/me")
async def me(request: RequestWithAuthState):
    try:
        app_user = get_app_user_by_auth_id(request.state.auth_id)

        if app_user is None:
            log_error(
                PermissionError(
                    "This route should never be called if the user is not authenticated"
                )
            )
            return {"success": False, "error": "User not found"}

        return {
            "success": True,
            "id": app_user.id,
            "email": app_user.email,
            "display_name": app_user.display_name,
            "permission_level": app_user.permission_level,
        }
    except Exception as e:
        log_error(e)
        return {
            "success": False,
            "error": "Failed to get user",
        }
