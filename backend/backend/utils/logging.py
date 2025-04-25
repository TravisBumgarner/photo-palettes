import logging

logger = logging.getLogger(__name__)


def log_error(error: Exception) -> None:
    """Log an error with traceback."""
    logger.exception(error)
