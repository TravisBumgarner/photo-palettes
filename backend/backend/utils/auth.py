from backend.middleware.auth import RequestWithAuthState


def user_owns_resource(request: RequestWithAuthState, resource: dict) -> bool:
    if request.state.app_user_id is None:
        return False

    return request.state.app_user_id == resource.app_user_id
