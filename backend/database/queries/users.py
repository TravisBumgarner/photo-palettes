import uuid
from datetime import datetime

from common.models import AppUser
from sqlalchemy.orm import Session

from database.engine import db_engine


def get_app_user_by_app_user_id(app_user_id: uuid.UUID) -> AppUser | None:
    with Session(db_engine) as session:
        return session.query(AppUser).filter(AppUser.id == app_user_id).first()


def get_app_user_by_auth_id(auth_id: uuid.UUID) -> AppUser | None:
    with Session(db_engine) as session:
        return session.query(AppUser).filter(AppUser.auth_id == auth_id).first()


def get_app_user_by_email(email: str) -> AppUser | None:
    with Session(db_engine) as session:
        return session.query(AppUser).filter(AppUser.email == email).first()


def insert_app_user(auth_id: uuid.UUID, email: str) -> AppUser:
    with Session(db_engine) as session:
        id = uuid.uuid4()
        display_name = f"#{str(id)[0:6]}"

        app_user = AppUser(
            id=id,
            auth_id=auth_id,
            email=email,
            display_name=display_name,
            created_at=datetime.now(),
        )

        session.add(app_user)
        session.commit()
        session.refresh(app_user)
        return app_user


def get_or_create_app_user(auth_id: uuid.UUID, email: str) -> AppUser:
    app_user = get_app_user_by_auth_id(auth_id)
    if not app_user:
        app_user = insert_app_user(auth_id, email)
    return app_user
