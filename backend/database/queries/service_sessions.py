from typing import Optional

from database import db_engine
from database.models import ServiceSession
from sqlalchemy import select
from sqlalchemy.orm import Session


def get_service_session(service: str) -> Optional[dict]:
    with Session(db_engine) as session:
        stmt = select(ServiceSession).where(ServiceSession.service == service)
        result = session.execute(stmt).scalar_one_or_none()
        return result.session_json if result else None


def set_service_session(service: str, session_json: dict) -> bool:
    with Session(db_engine) as session:
        stmt = select(ServiceSession).where(ServiceSession.service == service)
        result = session.execute(stmt).scalar_one_or_none()

        if result:
            result.session_json = session_json
        else:
            result = ServiceSession(service=service, session_json=session_json)
            session.add(result)

        session.commit()
        return True
