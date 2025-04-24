from fastapi import APIRouter, Request

router = APIRouter()


@router.get("/whoami")
async def whoami(request: Request):
    return {"message": "Hello, " + request.state.authDetails_id}
