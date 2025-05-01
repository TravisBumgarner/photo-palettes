from database.queries.users import get_app_user_by_auth_id
from middleware.auth import RequestWithAuthState
from services.logger import log_error

from . import users_router


@users_router.get("/me")
async def me(request: RequestWithAuthState):
    try:
        if not request.state.auth_id:
            log_error(
                PermissionError(
                    "This route should never be called if the user is not authenticated - no auth_id"
                ),
                "get_me_not_authenticated",
            )
            return {"success": False, "error": "User not authenticated"}

        app_user = get_app_user_by_auth_id(request.state.auth_id)

        if app_user is None:
            log_error(
                PermissionError(
                    "This route should never be called if the user is not authenticated - no app_user"
                ),
                "get_me_not_found",
            )
            return {"success": False, "error": "User not found"}

        return {
            "success": True,
            "id": app_user.id,
            "email": app_user.email,
            "displayName": app_user.display_name,
            "permissionLevel": app_user.permission_level,
        }
    except Exception as e:
        log_error(e, "get_me")
        return {
            "success": False,
            "error": "Failed to get user",
        }
