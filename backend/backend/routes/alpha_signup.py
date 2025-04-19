from fastapi import APIRouter
from pydantic import BaseModel, EmailStr

from backend.database import models
from backend.database.deps import get_db
from backend.middleware.auth import public_routes

ALPHA_SIGNUP_ROUTE = "/alpha-signup"
public_routes.add(ALPHA_SIGNUP_ROUTE)


class AlphaSignupRequest(BaseModel):
    email: EmailStr


router = APIRouter()


@router.post(ALPHA_SIGNUP_ROUTE)
def alpha_signup(request: AlphaSignupRequest):
    db = next(get_db())
    db.add(models.AlphaSignup(email=request.email))
    db.commit()
    return {"message": "Alpha signup successful"}
