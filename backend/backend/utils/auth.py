from typing import Any, Dict, Union

from pydantic import BaseModel

from backend.database.models import PermissionLevel
from backend.middleware.auth import RequestWithAuthState


def user_owns_resource(
    request: RequestWithAuthState, resource: Union[Dict[str, Any], BaseModel]
) -> bool:
    if request.state.app_user_id is None:
        return False

    if isinstance(resource, dict):
        app_user_id = resource.get("app_user_id")
    else:
        app_user_id = getattr(resource, "app_user_id", None)

    return request.state.app_user_id == app_user_id


def user_is_admin(request: RequestWithAuthState) -> bool:
    return request.state.permission_level == PermissionLevel.ADMIN


def user_is_moderator(request: RequestWithAuthState) -> bool:
    return request.state.permission_level in {PermissionLevel.MODERATOR, PermissionLevel.ADMIN}
