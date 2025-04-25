from fastapi import APIRouter

from backend.services.logger import log_error

router = APIRouter()


@router.get("/")
def read_root():
    try:
        return {"message": "Hello, World!"}
    except Exception as e:
        log_error(e)
        return {"message": "Failed to get root"}
