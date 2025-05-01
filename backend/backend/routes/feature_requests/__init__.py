from fastapi import APIRouter

feature_requests_router = APIRouter()

# Required to attach routes to router.
from . import add_feature_request, get_feature_request_list, upvote
