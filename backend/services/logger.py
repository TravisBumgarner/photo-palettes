import sentry_sdk

from config import get_config

config = get_config()


def log_error(error: Exception, name: str):
    if config.is_production:
        sentry_sdk.capture_exception(error, name)
    else:
        print("sentry_error", name, error)  # noqa: T201
