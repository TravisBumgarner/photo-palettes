from typing import Union
from fastapi import FastAPI, Request
from supabase import create_client, Client

from backend.config import config
from backend.middleware import create_auth_middleware, setup_cors

supabase: Client = create_client(config.supabase.url, config.supabase.key)

app = FastAPI()

# Setup middleware
app.middleware("http")(create_auth_middleware(supabase))
setup_cors(app, config.environment)

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

