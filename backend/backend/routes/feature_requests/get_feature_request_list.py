from backend.database.queries.feature_requests import get_votes
from backend.routes.feature_requests.feature_request_response_models import (
    map_feature_request_array_to_response,
)
from backend.services.logger import log_error

from . import feature_requests_router


@feature_requests_router.get("/")
async def get_list():
    try:
        feature_requests = get_votes()
        return {
            "success": True,
            "featureRequests": map_feature_request_array_to_response(feature_requests),
        }
    except Exception as e:
        log_error(e)
        return {
            "success": False,
            "error": str(e),
        }
