from enum import Enum


class ERROR_MSG(str, Enum):
    USER_NOT_AUTHENTICATED = "User must be authenticated"
    USER_DOES_NOT_EXIST = "User does not exist"
    CANNOT_PERFORM_ACTION = "User cannot perform action"  # Leak no secrets.
    SOMETHING_WENT_WRONG = "Something went wrong"
    USER_DOES_NOT_OWN_RESOURCE = "User does not own resource"
    RESOURCE_NOT_FOUND = "Resource not found"
