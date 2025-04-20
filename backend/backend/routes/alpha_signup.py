from fastapi import APIRouter
from pydantic import BaseModel, EmailStr

from backend.database.queries import insert_alpha_signup
from backend.middleware.auth import public_routes

ALPHA_SIGNUP_ROUTE = "/alpha-signup"
public_routes.add(ALPHA_SIGNUP_ROUTE)


class AlphaSignupRequest(BaseModel):
    email: EmailStr


router = APIRouter()


@router.post(ALPHA_SIGNUP_ROUTE)
def alpha_signup(request: AlphaSignupRequest):
    insert_alpha_signup(request.email)
    return {"message": "Alpha signup successful"}
