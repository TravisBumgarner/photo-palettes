from typing import Generator

from sqlalchemy.orm import Session

from .engine import db_engine


def get_db() -> Generator[Session, None, None]:
    with Session(db_engine) as session:
        yield session
