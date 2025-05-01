from pydantic import BaseModel, EmailStr

from database.queries.apha_users import insert_alpha_signup

from . import alpha_router


class AlphaSignupRequest(BaseModel):
    email: EmailStr


@alpha_router.post("/signup")
def alpha_signup(request: AlphaSignupRequest):
    try:
        insert_alpha_signup(request.email)
        return {"success": True}
    except Exception:
        return {"success": False, "error": "Failed to sign up"}
