from pydantic import BaseModel


class BaseErrorResponse(BaseModel):
    success: bool = False
    message: str


class BaseSuccessResponse(BaseModel):
    success: bool = True
