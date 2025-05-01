from database.engine import SessionLocal
from database.models import AlphaSignup


def insert_alpha_signup(email: str) -> AlphaSignup:
    session = SessionLocal()
    alpha_signup = AlphaSignup(email=email)
    session.add(alpha_signup)
    session.commit()
    return alpha_signup
