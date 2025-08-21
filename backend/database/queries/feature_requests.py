import uuid
from typing import List

from sqlalchemy.orm import Session, joinedload

from database.engine import db_engine
from database.models import FeatureRequest, FeatureRequestVote


def cast_vote(request_id: uuid.UUID, app_user_id: uuid.UUID) -> None:
    with Session(db_engine) as session:
        vote = FeatureRequestVote(request_id=request_id, app_user_id=app_user_id)
        session.add(vote)
        session.commit()


def add_feature_request(title: str, description: str) -> uuid.UUID:
    with Session(db_engine) as session:
        feature_request = FeatureRequest(title=title, description=description)
        session.add(feature_request)
        session.commit()
        session.refresh(feature_request)
        return feature_request.id


def get_votes() -> List[FeatureRequest]:
    with Session(db_engine) as session:
        return session.query(FeatureRequest).options(joinedload(FeatureRequest.votes)).all()


def has_user_voted(request_id: uuid.UUID, app_user_id: uuid.UUID) -> bool:
    with Session(db_engine) as session:
        return (
            session.query(FeatureRequestVote)
            .filter(
                FeatureRequestVote.request_id == request_id,
                FeatureRequestVote.app_user_id == app_user_id,
            )
            .count()
            > 0
        )
