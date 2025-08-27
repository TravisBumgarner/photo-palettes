import os
import uuid

import pytest
import requests

from consts import ERROR_MSG
from database.models import ModerationStatus
from database.queries.palettes import create_palette, delete_palette_by_id

from .utils import (
    generate_color,
    generate_palette,
    get_moderator_app_user_id,
    get_moderator_auth_headers,
    get_user_app_user_id,
    get_user_auth_headers,
)

BASE_URL = "http://localhost:8000"


def is_server_up():
    try:
        requests.get(BASE_URL)
        return True
    except requests.ConnectionError:
        return False


@pytest.fixture(scope="session", autouse=True)
def check_server():
    if not is_server_up():
        pytest.fail(
            "Server is not running at localhost:8000. Start the server with docker-compose up --build"
        )


def test_root_endpoint():
    response = requests.get(f"{BASE_URL}/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello, World!"}


def test_me_unauthorized():
    response = requests.get(f"{BASE_URL}/users/me")
    assert response.status_code == 401
    assert "error" in response.json()
    assert response.json()["error"] == "Unauthorized"


def test_me_authorized():
    response = requests.get(f"{BASE_URL}/users/me", headers=get_user_auth_headers())
    assert "permissionLevel" in response.json()
    assert "displayName" in response.json()
    assert "email" in response.json()
    assert "id" in response.json()
    assert response.json()["email"] == os.getenv("TEST_USER_EMAIL")


def test_get_palettes_list():
    # If you're seeing errors with this test, stop using test user and test moderator to do things.
    color = generate_color()
    app_user_id = get_user_app_user_id()
    palette_approved_1 = generate_palette(app_user_id)
    palette_approved_1.colors.append(color)
    create_palette(palette=palette_approved_1)

    palette_approved_2 = generate_palette(app_user_id)
    palette_approved_2.colors.append(color)
    create_palette(palette=palette_approved_2)

    palette_unapproved = generate_palette(app_user_id, moderation_status=ModerationStatus.REJECTED)
    palette_unapproved.colors.append(color)
    create_palette(palette=palette_unapproved)
    try:
        # A user, when requesting without a moderation status, should only see approved palettes
        response = requests.get(f"{BASE_URL}/palettes", headers=get_user_auth_headers())
        assert "palettes" in response.json()
        response_ids = [uuid.UUID(palette["id"]) for palette in response.json()["palettes"]]
        assert palette_approved_1.id in response_ids
        assert palette_approved_2.id in response_ids
        assert palette_unapproved.id not in response_ids

        # A user, when requesting with an approved moderation status, should see only the palettes with that status
        response = requests.get(
            f"{BASE_URL}/palettes?moderation_status={ModerationStatus.APPROVED}&author_user_id={app_user_id}",
            headers=get_user_auth_headers(),
        )
        assert "palettes" in response.json()
        response_ids = [uuid.UUID(palette["id"]) for palette in response.json()["palettes"]]
        assert palette_approved_1.id in response_ids
        assert palette_approved_2.id in response_ids
        assert palette_unapproved.id not in response_ids

        # A user, when requesting with a rejected moderation status, should see only the palettes with that status
        response = requests.get(
            f"{BASE_URL}/palettes?moderation_status={ModerationStatus.REJECTED}&author_user_id={app_user_id}",
            headers=get_user_auth_headers(),
        )
        assert "palettes" in response.json()
        response_ids = [uuid.UUID(palette["id"]) for palette in response.json()["palettes"]]
        assert palette_unapproved.id in response_ids
        assert palette_approved_1.id not in response_ids

        # A user, not the original author, should only see approved palettes.
        response = requests.get(
            f"{BASE_URL}/palettes?moderation_status={ModerationStatus.APPROVED}&author_user_id={app_user_id}",
            headers=get_moderator_auth_headers(),
        )
        assert "palettes" in response.json()
        response_ids = [uuid.UUID(palette["id"]) for palette in response.json()["palettes"]]
        assert palette_approved_1.id in response_ids
        assert palette_approved_2.id in response_ids
        assert palette_unapproved.id not in response_ids

        # A user, not the original author, should not see rejected palettes.
        response = requests.get(
            f"{BASE_URL}/palettes?moderation_status={ModerationStatus.REJECTED}&author_user_id={app_user_id}",
            headers=get_moderator_auth_headers(),
        )
        assert "palettes" in response.json()
        response_ids = [uuid.UUID(palette["id"]) for palette in response.json()["palettes"]]
        assert palette_unapproved.id not in response_ids
        assert palette_approved_1.id in response_ids
        assert palette_approved_2.id in response_ids
    finally:
        delete_palette_by_id(palette_approved_1.id)
        delete_palette_by_id(palette_approved_2.id)
        delete_palette_by_id(palette_unapproved.id)


def test_generate_palette_file_too_large():
    # Create a 11MB file
    test_file_path = "test_large_image.jpg"
    with open(test_file_path, "wb") as f:
        f.write(os.urandom(11 * 1024 * 1024))  # 11MB

    try:
        with open(test_file_path, "rb") as f:
            files = {"photo": ("test.jpg", f, "image/jpeg")}
            extension = "jpg"
            response = requests.post(
                f"{BASE_URL}/palettes/generate",
                files=files,
                headers=get_user_auth_headers(),
                data={"extension": extension},
            )

        assert response.status_code == 413
        assert "error" in response.json()
        assert "File too large" in response.json()["error"]
    finally:
        os.remove(test_file_path)


def test_moderate_palette():
    palette_id = str(uuid.uuid4())

    response = requests.post(
        f"{BASE_URL}/palettes/moderate",
        headers={**get_moderator_auth_headers(), "Content-Type": "application/json"},
        json={"palette_id": palette_id, "status": 2},
    )
    # Status code 400 means the user is not a moderator. The test will fail for other reasons because palette doesn't exist.
    assert response.status_code != 400


def test_moderate_palette_unauthorized():
    palette_id = str(uuid.uuid4())

    response = requests.post(
        f"{BASE_URL}/palettes/moderate",
        headers={**get_user_auth_headers(), "Content-Type": "application/json"},
        json={"palette_id": palette_id, "status": 2},
    )
    # Status code 400 means the user is not a moderator. The test will fail for other reasons because palette doesn't exist.
    assert not response.json()["success"]
    assert response.json()["message"] == ERROR_MSG.CANNOT_PERFORM_ACTION


def test_feature_requests():
    create_response = requests.post(
        f"{BASE_URL}/feature_requests",
        headers={**get_moderator_auth_headers(), "Content-Type": "application/json"},
        json={"title": "Test Feature Request", "description": "Test Description"},
    )
    assert create_response.json()["success"] == True

    feature_request_id = create_response.json()["featureRequestId"]

    upvote_response = requests.post(
        f"{BASE_URL}/feature_requests/upvote",
        headers={**get_user_auth_headers(), "Content-Type": "application/json"},
        json={"feature_request_id": feature_request_id},
    )
    assert upvote_response.json()["success"] == True


def test_feature_requests_unauthorized():
    response = requests.post(
        f"{BASE_URL}/feature_requests",
        headers=get_user_auth_headers(),
        json={"title": "Test Feature Request", "description": "Test Description"},
    )
    assert not response.json()["success"]
    assert response.json()["message"] == ERROR_MSG.CANNOT_PERFORM_ACTION


def test_delete_palette_as_not_resource_owner():
    color = generate_color()
    app_user_id = get_moderator_app_user_id()
    palette = generate_palette(app_user_id)
    palette.colors.append(color)
    create_palette(
        palette=palette,
    )

    delete_response = requests.delete(
        f"{BASE_URL}/palettes/id/{palette.id}",
        headers=get_user_auth_headers(),
    )
    assert not delete_response.json()["success"]
    delete_palette_by_id(palette.id)


def test_delete_palette_as_moderator():
    color = generate_color()
    app_user_id = get_user_app_user_id()
    palette = generate_palette(app_user_id)
    palette.colors.append(color)
    create_palette(
        palette=palette,
    )

    delete_response = requests.delete(
        f"{BASE_URL}/palettes/id/{palette.id}",
        headers=get_moderator_auth_headers(),
    )
    assert delete_response.json()["success"]
