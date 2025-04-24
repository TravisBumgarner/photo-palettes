from fastapi import Request


def user_owns_resource(request: Request, resource: dict) -> bool:
    if request.state.authDetails_id is None:
        return False

    return request.state.authDetails_id == resource.user_id
