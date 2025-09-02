from collections.abc import Generator

from sqlalchemy.orm import Session

from .engine import db_engine


def get_db() -> Generator[Session]:
    with Session(db_engine) as session:
        yield session
