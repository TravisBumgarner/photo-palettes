import os

import pytest
import requests

from .utils import get_auth_headers

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


def test_whoami_unauthorized():
    response = requests.get(f"{BASE_URL}/whoami")
    assert response.status_code == 401
    assert "error" in response.json()
    assert response.json()["error"] == "Unauthorized"


def test_whoami_authorized():
    response = requests.get(f"{BASE_URL}/whoami", headers=get_auth_headers())
    assert response.status_code == 200
    assert "message" in response.json()


def test_generate_palette_file_too_large():
    # Create a 11MB file
    test_file_path = "test_large_image.jpg"
    with open(test_file_path, "wb") as f:
        f.write(os.urandom(11 * 1024 * 1024))  # 11MB

    try:
        with open(test_file_path, "rb") as f:
            files = {"photo": ("test.jpg", f, "image/jpeg")}
            response = requests.post(
                f"{BASE_URL}/generate-palette", files=files, headers=get_auth_headers()
            )

        assert response.status_code == 413
        assert "error" in response.json()
        assert "File too large" in response.json()["error"]
    finally:
        os.remove(test_file_path)
