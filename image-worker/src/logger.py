import traceback
import uuid

import sentry_sdk

from src.config import get_config

config = get_config()


def log_error(
    error: Exception, name: str, sub_name: str | None = None, app_user_id: uuid.UUID | None = None
):
    if config.is_production:
        with sentry_sdk.push_scope() as scope:
            scope.set_extra("name", name)
            if sub_name:
                scope.set_extra("sub_name", sub_name)
            if app_user_id:
                scope.set_user({"id": str(app_user_id)})
            sentry_sdk.capture_exception(error)
    else:
        print("sentry_error", name, error)  # noqa: T201
        print(traceback.format_exc())  # noqa: T201
