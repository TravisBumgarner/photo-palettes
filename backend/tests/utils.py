import os
import uuid
from pathlib import Path

from dotenv import load_dotenv
from supabase import create_client

from config import get_config
from database.models import Palette, PaletteColor
from database.queries.users import get_app_user_by_email

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


def get_user_app_user_id() -> uuid.UUID:
    email = os.getenv("TEST_USER_EMAIL") or ""
    app_user = get_app_user_by_email(email)
    if app_user:
        return app_user.id
    else:
        raise Exception("Test user not found in the database. Please check the email in .env file.")


def get_moderator_app_user_id() -> uuid.UUID:
    email = os.getenv("TEST_MODERATOR_EMAIL") or ""
    app_user = get_app_user_by_email(email)
    if app_user:
        return app_user.id
    else:
        raise Exception(
            "Test moderator not found in the database. Please check the email in .env file."
        )


def generate_palette(app_user_id: uuid.UUID):
    return Palette(
        app_user_id=app_user_id,
        name="Test Palette",
        photo_details="test_photo.jpg",
        og_photo_details="test_og_photo.jpg",
        blurhash="LKO2?U%2Tw=w]~RBVZRi};RPxuwH",
        aspect_ratio=1.0,
    )


def generate_color():
    return PaletteColor(hex="#FFFFFF", r=1, g=1, b=1, rgb_cube="(255,255,255)")
