from supabase import create_client

from backend.config import get_config

config = get_config()


def get_auth_headers():
    supabase = create_client(config.supabase.url, config.supabase.key)

    # This is bad lol. Will work on later.
    auth_response = supabase.auth.sign_in_with_password(
        {
            "email": "hello+pp-test-user@travisbumgarner.dev",
            "password": "Tractor1-Regally6-Reprise9",
        }
    )

    token = auth_response.session.access_token
    return {"Authorization": f"Bearer {token}"}
