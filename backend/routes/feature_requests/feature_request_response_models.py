import uuid
from typing import List

from pydantic import BaseModel

from database.models import FeatureRequest


class FeatureRequestResponse(BaseModel):
    id: uuid.UUID
    title: str
    description: str
    status: int
    votes: List[uuid.UUID]


def map_feature_request_to_response(feature_request: FeatureRequest) -> FeatureRequestResponse:
    return FeatureRequestResponse(
        id=feature_request.id,
        title=feature_request.title,
        description=feature_request.description,
        status=feature_request.status,
        votes=[vote.app_user_id for vote in feature_request.votes],
    )


def map_feature_request_array_to_response(
    feature_requests: List[FeatureRequest],
) -> List[FeatureRequestResponse]:
    return [
        map_feature_request_to_response(feature_request) for feature_request in feature_requests
    ]
