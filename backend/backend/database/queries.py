from datetime import datetime

from backend.database.engine import SessionLocal
from backend.database.models import Palette, User


def get_user_by_user_id(user_id: str) -> User | None:
    session = SessionLocal()

    return session.query(User).filter(User.id == user_id).first()


def get_user_by_auth_id(auth_id: str) -> User | None:
    session = SessionLocal()

    return session.query(User).filter(User.auth_id == auth_id).first()


def insert_user(auth_id: str, email: str, display_name: str) -> User:
    session = SessionLocal()

    user = User(
        auth_id=auth_id,
        email=email,
        display_name=display_name,
        created_at=datetime.now(),
    )

    session.add(user)
    session.commit()
    session.refresh(user)
    return user


def get_or_create_user(auth_id: str, email: str, display_name: str) -> User:
    user = get_user_by_auth_id(auth_id)
    if not user:
        user = insert_user(auth_id, email, display_name)
    return user


def get_palette_by_id(palette_id: str) -> Palette | None:
    session = SessionLocal()
    return session.query(Palette).filter(Palette.id == palette_id).first()
