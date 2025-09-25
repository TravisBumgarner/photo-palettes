import uuid

from common.models import (
    BlueskyPostData,
    ImageWorkerActionEnum,
    InstagramPostData,
    PermissionLevel,
    TwitterPostData,
)
from common.queries.worker import insert_image_worker
from pydantic import BaseModel

from consts import ErrorMsg
from database.engine import db_engine
from middleware.auth import RequestWithAuthState
from routes.shared import (
    BaseErrorResponse,
    BaseSuccessResponse,
)
from services.logger import log_error

from .palettes_router import palettes_router


class Body(BaseModel):
    palette_id: uuid.UUID
    share_to_bluesky: bool
    share_to_instagram: bool
    share_to_twitter: bool
    bluesky_hashtags: list[str] = []
    instagram_hashtags: list[str] = []
    twitter_hashtags: list[str] = []
    caption: str


ROUTE_NAME = "share_to_socials"


def handle_request(body: Body):
    if body.share_to_bluesky:
        # Linter sometimes complains about BlueskyPostData relying on itself???s
        bluesky_post_data = BlueskyPostData(
            palette_id=body.palette_id,
            hashtags=body.bluesky_hashtags,
            caption=body.caption,
        )

        insert_image_worker(
            db_engine=db_engine,
            palette_id=body.palette_id,
            action_type=ImageWorkerActionEnum.POST_TO_BLUESKY,
            json_data=bluesky_post_data,
        )

    if body.share_to_instagram:
        instagram_post_data = InstagramPostData(
            palette_id=body.palette_id,
            hashtags=body.instagram_hashtags,
            caption=body.caption,
        )

        insert_image_worker(
            db_engine=db_engine,
            palette_id=body.palette_id,
            action_type=ImageWorkerActionEnum.POST_TO_INSTAGRAM,
            json_data=instagram_post_data,
        )

    if body.share_to_twitter:
        twitter_post_data = TwitterPostData(
            palette_id=body.palette_id,
            hashtags=body.twitter_hashtags,
            caption=body.caption,
        )

        insert_image_worker(
            db_engine=db_engine,
            palette_id=body.palette_id,
            action_type=ImageWorkerActionEnum.POST_TO_TWITTER,
            json_data=twitter_post_data,
        )

    return BaseSuccessResponse()


@palettes_router.post("/share_to_socials")
async def moderate(
    request: RequestWithAuthState,
    body: Body,
):
    if request.state.permission_level < PermissionLevel.MODERATOR:
        log_error(
            RuntimeError(ErrorMsg.CANNOT_PERFORM_ACTION),
            ROUTE_NAME,
            app_user_id=request.state.app_user_id,
        )
        return BaseErrorResponse(message=ErrorMsg.CANNOT_PERFORM_ACTION)

    try:
        return handle_request(body)
    except Exception as error:
        log_error(error, ROUTE_NAME)
        return BaseErrorResponse(message=ErrorMsg.SOMETHING_WENT_WRONG)
