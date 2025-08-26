from enum import Enum


class ERROR_MSG(str, Enum):
    USER_NOT_AUTHENTICATED = "User must be authenticated"
    INVALID_USER_ID = "Invalid user ID"
    CANNOT_PERFORM_ACTION = "User cannot perform action"  # Leak no secrets.
    SOMETHING_WENT_WRONG = "Something went wrong"
