from backend.utils.pushover import send_notification as send_pushover_notification


def send_notification(message: str) -> None:
    """Send a notification using Pushover."""
    send_pushover_notification(message)
