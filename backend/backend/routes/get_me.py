from fastapi import APIRouter, Request

from backend.database.queries import get_user_by_auth_id

router = APIRouter()


@router.get("/me")
async def me(request: Request):
    user = get_user_by_auth_id(request.state.auth_id)

    if user is None:
        return None

    return {
        "id": user.id,
        "email": user.email,
        "display_name": user.display_name,
        "permission_level": user.permission_level,
    }
