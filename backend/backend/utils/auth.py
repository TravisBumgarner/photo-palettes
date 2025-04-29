import uuid
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

    if app_user_id is None:
        return False

    # Convert both to UUID for comparison
    try:
        request_user_id = uuid.UUID(str(request.state.app_user_id))
        resource_user_id = uuid.UUID(str(app_user_id))
        return request_user_id == resource_user_id
    except (ValueError, TypeError):
        return False


def user_is_moderator(request: RequestWithAuthState) -> bool:
    if not request.state.app_user_id or not request.state.permission_level:
        return False
    return request.state.permission_level in {PermissionLevel.MODERATOR, PermissionLevel.ADMIN}
