import sentry_sdk

from backend.config import get_config

config = get_config()


def log_error(error: Exception):
    if config.environment == "production":
        sentry_sdk.capture_exception(error)
    else:
        print("sentry_error", error)
