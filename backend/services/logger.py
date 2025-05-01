import sentry_sdk

from config import get_config

config = get_config()


def log_error(error: Exception):
    if config.is_production:
        sentry_sdk.capture_exception(error)
    else:
        print("sentry_error", error)
