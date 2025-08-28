from database.models import PermissionLevel
from middleware.auth import RequestWithAuthState


def user_is_moderator(request: RequestWithAuthState) -> bool:
    if not request.state.app_user_id or not request.state.permission_level:
        return False
    return request.state.permission_level in {PermissionLevel.MODERATOR, PermissionLevel.ADMIN}


def user_is_authed(request: RequestWithAuthState) -> bool:
    return request.state.app_user_id is not None


def user_owns_resource(request: RequestWithAuthState, resource, key: str = "app_user_id") -> bool:
    if not request.state.app_user_id:
        return False

    return request.state.app_user_id == getattr(resource, key, None)
