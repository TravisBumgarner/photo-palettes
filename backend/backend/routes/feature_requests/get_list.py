from backend.database.queries.feature_requests import get_votes
from backend.services.logger import log_error

from . import feature_requests_router


@feature_requests_router.get("/")
async def get_list():
    try:
        feature_requests = get_votes()
        return {
            "success": True,
            "featureRequests": feature_requests,
        }
    except Exception as e:
        log_error(e)
        return {
            "success": False,
            "error": str(e),
        }
