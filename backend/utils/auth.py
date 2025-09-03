from uuid import UUID

from pydantic import BaseModel

from database.models import PermissionLevel
from middleware.auth import RequestWithAuthState


class UserAuth(BaseModel):
    app_user_id: UUID
    auth_id: UUID


def get_admin_auth(request: RequestWithAuthState) -> UserAuth | None:
    if not request.state.app_user_id or not request.state.auth_id:
        return None

    if (
        not request.state.permission_level
        or not request.state.permission_level == PermissionLevel.ADMIN
    ):
        return None

    return UserAuth(auth_id=request.state.auth_id, app_user_id=request.state.app_user_id)


def get_moderator_auth(request: RequestWithAuthState) -> UserAuth | None:
    if not request.state.app_user_id or not request.state.auth_id:
        return None

    if not request.state.permission_level or request.state.permission_level not in {
        PermissionLevel.MODERATOR,
        PermissionLevel.ADMIN,
    }:
        return None

    return UserAuth(auth_id=request.state.auth_id, app_user_id=request.state.app_user_id)


def get_user_auth(request: RequestWithAuthState) -> UserAuth | None:
    if request.state.app_user_id is None or request.state.auth_id is None:
        return None
    return UserAuth(app_user_id=request.state.app_user_id, auth_id=request.state.auth_id)


def user_owns_resource(request: RequestWithAuthState, resource, key: str = "app_user_id") -> bool:
    if not request.state.app_user_id:
        return False

    return request.state.app_user_id == getattr(resource, key, None)
