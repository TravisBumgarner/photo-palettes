from datetime import datetime
from typing import List

from backend.database.engine import SessionLocal
from backend.database.models import AlphaSignup, AppUser, Palette


def get_app_user_by_app_user_id(app_user_id: str) -> AppUser | None:
    session = SessionLocal()

    return session.query(AppUser).filter(AppUser.id == app_user_id).first()


def get_app_user_by_auth_id(auth_id: str) -> AppUser | None:
    session = SessionLocal()

    return session.query(AppUser).filter(AppUser.auth_id == auth_id).first()


def insert_app_user(auth_id: str, email: str, display_name: str) -> AppUser:
    session = SessionLocal()

    app_user = AppUser(
        auth_id=auth_id,
        email=email,
        display_name=display_name,
        created_at=datetime.now(),
    )

    session.add(app_user)
    session.commit()
    session.refresh(app_user)
    return app_user


def get_or_create_app_user(auth_id: str, email: str, display_name: str) -> AppUser:
    app_user = get_app_user_by_auth_id(auth_id)
    if not app_user:
        app_user = insert_app_user(auth_id, email, display_name)
    return app_user


def insert_alpha_signup(email: str) -> AlphaSignup:
    session = SessionLocal()
    alpha_signup = AlphaSignup(email=email)
    session.add(alpha_signup)
    session.commit()
    return alpha_signup


def get_all_palettes() -> List[Palette]:
    session = SessionLocal()
    return session.query(Palette).all()
