from consts import ERROR_MSG
from database.queries.feature_requests import get_votes
from routes.feature_requests.feature_request_response_models import (
    FeatureRequestResponse,
    map_feature_request_array_to_response,
)
from routes.shared import BaseErrorResponse, BaseSuccessResponse
from services.logger import log_error

from . import feature_requests_router

ROUTE_NAME = "get_feature_request_list"


def parse_request():
    # Shows no parsing required.
    pass


class SuccessResponse(BaseSuccessResponse):
    featureRequests: list[FeatureRequestResponse]  # noqa #815


@feature_requests_router.get("/")
async def get_list():
    parse_request()

    try:
        feature_requests = get_votes()
        return SuccessResponse(
            featureRequests=map_feature_request_array_to_response(feature_requests)
        )
    except Exception as error:
        log_error(error, ROUTE_NAME)
        return BaseErrorResponse(message=ERROR_MSG.SOMETHING_WENT_WRONG)
