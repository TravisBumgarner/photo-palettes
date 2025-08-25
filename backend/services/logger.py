import traceback

import sentry_sdk

from config import get_config

config = get_config()


def log_error(error: Exception, name: str):
    if config.is_production:
        with sentry_sdk.push_scope() as scope:
            scope.set_extra("name", name)
            sentry_sdk.capture_exception(error)
    else:
        print("sentry_error", name, error)  # noqa: T201
        print(traceback.format_exc())  # noqa: T201
