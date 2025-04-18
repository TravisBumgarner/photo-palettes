from contextlib import asynccontextmanager

import sentry_sdk
from fastapi import Depends, FastAPI, Form, Request
from pydantic import BaseModel, EmailStr
from sqlalchemy import select
from sqlalchemy.orm import Session
from supabase import Client, create_client

from backend.config import get_config
from backend.database import engine, models
from backend.database.deps import get_db
from backend.middleware import create_auth_middleware, setup_cors
from backend.middleware.auth import public_routes

config = get_config()

supabase: Client = create_client(config.supabase.url, config.supabase.key)

app = FastAPI()

sentry_sdk.init(
    dsn="https://f93e30187cac28b7c1985fe2c7640a90@o196886.ingest.us.sentry.io/4509166019936256",
    # Add data like request headers and IP for users,
    # see https://docs.sentry.io/platforms/python/data-management/data-collected/ for more info
    send_default_pii=True,
)


# Setup middleware
app.middleware("http")(create_auth_middleware(supabase))
setup_cors(app, config.environment)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Run startup logic here
    async with engine.begin() as conn:
        await conn.run_sync(models.Base.metadata.create_all)
    yield
    # Run shutdown logic here if needed


@app.get("/")
def read_root():
    return {"message": "Hello, World!"}


ALPHA_SIGNUP_ROUTE = "/alpha-signup"
public_routes.add(ALPHA_SIGNUP_ROUTE)


class AlphaSignupRequest(BaseModel):
    email: EmailStr


@app.post(ALPHA_SIGNUP_ROUTE)
def alpha_signup(request: AlphaSignupRequest):
    db = next(get_db())
    db.add(models.AlphaSignup(email=request.email))
    db.commit()
    return {"message": "Alpha signup successful"}


@app.get("/whoami")
async def whoami(request: Request):
    return {"message": "Hello, " + request.state.user.email}
