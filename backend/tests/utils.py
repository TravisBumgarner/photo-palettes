import os
from pathlib import Path

from dotenv import load_dotenv
from supabase import create_client

from backend.config import get_config

# Load environment variables from tests/.env
load_dotenv(Path(__file__).parent / ".env")

config = get_config()


def get_user_auth_headers():
    # First thing to check if this test is failing is if the test user exists is a user.
    supabase = create_client(config.supabase.url, config.supabase.key)

    email = os.getenv("TEST_USER_EMAIL")
    password = os.getenv("TEST_USER_PASSWORD")

    if not email or not password:
        raise Exception("Missing test user credentials in environment variables")

    auth_response = supabase.auth.sign_in_with_password(
        {
            "email": email,
            "password": password,
        }
    )

    if not auth_response.session:
        raise Exception("Failed to sign in")

    token = auth_response.session.access_token
    return {"Authorization": f"Bearer {token}"}


def get_moderator_auth_headers():
    # First thing to check if this test is failing is if the test user exists and is a moderator.
    supabase = create_client(config.supabase.url, config.supabase.key)

    email = os.getenv("TEST_MODERATOR_EMAIL")
    password = os.getenv("TEST_MODERATOR_PASSWORD")

    if not email or not password:
        raise Exception("Missing test moderator credentials in environment variables")

    auth_response = supabase.auth.sign_in_with_password(
        {
            "email": email,
            "password": password,
        }
    )

    if not auth_response.session:
        raise Exception("Failed to sign in")

    token = auth_response.session.access_token
    return {"Authorization": f"Bearer {token}"}
