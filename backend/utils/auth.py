from uuid import UUID

from database.models import PermissionLevel
from middleware.auth import RequestWithAuthState


def get_moderator_auth(request: RequestWithAuthState) -> dict[str, UUID] | None:
    if not request.state.app_user_id or not request.state.auth_id:
        return None

    if not request.state.permission_level or request.state.permission_level not in {
        PermissionLevel.MODERATOR,
        PermissionLevel.ADMIN,
    }:
        return None

    return {"app_user_id": request.state.app_user_id, "auth_id": request.state.auth_id}


def get_user_auth(request: RequestWithAuthState) -> dict[str, UUID] | None:
    if request.state.app_user_id is None or request.state.auth_id is None:
        return None
    return {"app_user_id": request.state.app_user_id, "auth_id": request.state.auth_id}


def user_owns_resource(request: RequestWithAuthState, resource, key: str = "app_user_id") -> bool:
    if not request.state.app_user_id:
        return False

    return request.state.app_user_id == getattr(resource, key, None)
