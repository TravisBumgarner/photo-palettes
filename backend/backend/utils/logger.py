import sentry_sdk


def log_error(error: Exception):
    sentry_sdk.capture_exception(error)
