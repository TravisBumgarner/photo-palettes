from middleware.auth import RequestWithAuthState


def user_owns_resource(
    request: RequestWithAuthState, resource, key: str = "app_user_id"
) -> bool:
    if not request.state.app_user_id:
        return False

    return request.state.app_user_id == getattr(resource, key, None)
