import uuid

from common.models import PermissionLevel
from pydantic import BaseModel
from supabase import Client, create_client

from config import get_config
from database.queries.users import get_or_create_app_user

config = get_config()
supabase_anon: Client = create_client(config.supabase.url, config.supabase.anon_key)
supabase_service: Client = create_client(config.supabase.url, config.supabase.service_role_key)


def delete_user(user_id: str):
    # Calls the GoTrue Admin API under the hood
    resp = supabase_service.auth.admin.delete_user(user_id)
    if resp and resp.get("error"):
        raise Exception(resp["error"]["message"])
    return resp


def get_auth_user(token: str):
    if not token or token == "undefined":
        return None

    auth = supabase_anon.auth.get_user(token)

    if not auth or not auth.user:
        return None

    supabase_anon.postgrest.auth(token)
    return auth.user


class AppUserDetails(BaseModel):
    app_user_id: uuid.UUID
    permission_level: PermissionLevel


def get_app_user_details(auth_user):
    app_user = get_or_create_app_user(
        auth_id=uuid.UUID(auth_user.id),
        email=auth_user.email,
    )

    return AppUserDetails(
        app_user_id=app_user.id,
        permission_level=app_user.permission_level,
    )
