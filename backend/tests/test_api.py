import pytest
import requests

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
    # This is a mock token - in real tests you'd want to generate a real one
    headers = {"Authorization": "Bearer foobar"}
    response = requests.get(f"{BASE_URL}/whoami", headers=headers)
    assert response.status_code == 401  # Should still be 401 because token is invalid
    assert "error" in response.json()
    assert response.json()["error"] == "Unauthorized"
