import uuid
from typing import List

from sqlalchemy.orm import joinedload

from backend.database.engine import SessionLocal
from backend.database.models import FeatureRequest, FeatureRequestVote


def cast_vote(request_id: uuid.UUID, app_user_id: uuid.UUID) -> None:
    session = SessionLocal()
    vote = FeatureRequestVote(request_id=request_id, app_user_id=app_user_id)
    session.add(vote)
    session.commit()


def uncast_vote(request_id: uuid.UUID, app_user_id: uuid.UUID) -> None:
    session = SessionLocal()
    session.query(FeatureRequestVote).filter(
        FeatureRequestVote.request_id == request_id,
        FeatureRequestVote.app_user_id == app_user_id,
    ).delete()
    session.commit()


def add_feature_request(title: str, description: str) -> uuid.UUID:
    session = SessionLocal()
    feature_request = FeatureRequest(title=title, description=description)
    session.add(feature_request)
    session.commit()
    session.refresh(feature_request)
    return feature_request.id


def get_votes() -> List[FeatureRequest]:
    session = SessionLocal()
    return session.query(FeatureRequest).options(joinedload(FeatureRequest.votes)).all()


def get_votes_by_app_user_id(app_user_id: uuid.UUID) -> List[FeatureRequestVote]:
    session = SessionLocal()
    return (
        session.query(FeatureRequestVote)
        .options(joinedload(FeatureRequestVote.request))
        .filter(FeatureRequestVote.app_user_id == app_user_id)
        .all()
    )
