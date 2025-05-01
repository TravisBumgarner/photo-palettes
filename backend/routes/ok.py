from fastapi import APIRouter

from services.logger import log_error

router = APIRouter()


@router.get("/")
def read_root():
    try:
        return {"message": "Hello, World!"}
    except Exception as e:
        log_error(e, "ok")
        return {"message": "Failed to get root"}
