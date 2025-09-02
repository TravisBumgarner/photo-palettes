from fastapi import APIRouter

from routes.shared import BaseErrorResponse
from services.logger import log_error

router = APIRouter()

ROUTE_NAME = "ok"


@router.get("/")
def read_root():
    try:
        return {"message": "Hello, World!"}
    except Exception as e:
        log_error(e, ROUTE_NAME)
        return BaseErrorResponse(message="Failed to get root")
