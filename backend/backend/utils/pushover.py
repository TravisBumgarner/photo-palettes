import requests

from backend.config import get_config

config = get_config()


def send_notification(message: str) -> bool:
    if not config.is_production:
        return True

    try:
        post_data = {
            "token": config.pushover.app_token,
            "user": config.pushover.user_token,
            "title": "Photo Palettes",
            "message": message,
        }

        response = requests.post("https://api.pushover.net/1/messages.json", data=post_data)
        response.raise_for_status()
        return True
    except Exception as e:
        print(f"Error sending notification: {e}")
        return False
