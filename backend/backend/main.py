from typing import Union

from fastapi.middleware.cors import CORSMiddleware

from backend.config import config

from supabase import create_client, Client
from fastapi import FastAPI, Request

supabase: Client = create_client(config.supabase.url, config.supabase.key)

app = FastAPI()

@app.middleware("http")
async def add_authentication(request: Request, call_next):
    # Whitelist of routes that don't need auth
    public_routes = {
        "/",
        "/config",
        "/docs",
        "/redoc",
        "/openapi.json"
    }

    if request.url.path in public_routes:
        return await call_next(request)

    if request.method == "OPTIONS":
        return await call_next(request)

    token = request.headers.get("authorization", "").replace("Bearer", "")

    if not token:
        return Response("Unauthorized", status_code=401)

    try:
        auth = supabase.auth.get_user(token)
        request.state.user = auth.user
        request.state.user_id = auth.user.id
        supabase.postgrest.auth(token)

    except Exception:
        return Response("Invalid user token", status_code=401)

    return await call_next(request)


if config.environment == "local":
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
elif config.environment == "production":
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["https://photo-palettes-frontend-bb66abc40c21.herokuapp.com"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    raise ValueError("Invalid environment")


@app.get("/")
def read_root():
    return {"Hello": "World!"}


@app.get("/config")
def read_config():
    return config


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


@app.get("/whoami")
async def whoami(request: Request):
    print(request.state.user)
    return {"message": "Hello, " + request.state.user.email}

