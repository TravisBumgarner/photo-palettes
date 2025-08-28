import uuid

from pydantic import BaseModel


class BaseErrorResponse(BaseModel):
    success: bool = False
    message: str


class BaseSuccessResponse(BaseModel):
    success: bool = True


class InvalidRequest(BaseModel):
    error: str


class AuthedRequest(BaseModel):
    app_user_id: uuid.UUID
    auth_id: uuid.UUID
