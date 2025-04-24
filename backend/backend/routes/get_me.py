from fastapi import APIRouter

from backend.database.queries import get_app_user_by_auth_id
from backend.middleware.auth import RequestWithAuthState

router = APIRouter()


@router.get("/me")
async def me(request: RequestWithAuthState):
    app_user = get_app_user_by_auth_id(request.state.auth_id)

    if app_user is None:
        return None

    return {
        "id": app_user.id,
        "email": app_user.email,
        "display_name": app_user.display_name,
        "permission_level": app_user.permission_level,
    }
