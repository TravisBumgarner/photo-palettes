from database.models import PermissionLevel
from middleware.auth import RequestWithAuthState


def user_is_moderator(request: RequestWithAuthState) -> bool:
    if not request.state.app_user_id or not request.state.permission_level:
        return False
    return request.state.permission_level in {PermissionLevel.MODERATOR, PermissionLevel.ADMIN}
