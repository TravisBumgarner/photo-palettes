from contextlib import asynccontextmanager

import sentry_sdk
from fastapi import FastAPI
from supabase import Client, create_client

from backend.config import get_config
from backend.database import engine, models
from backend.middleware import create_auth_middleware, setup_cors
from backend.middleware.filesize import LimitUploadSizeMiddleware
from backend.routes import (
    alpha_signup,
    generate_palette,
    get_palettes,
    ok,
    save_palette,
    whoami,
)

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
MAX_UPLOAD_SIZE = 10 * 1024 * 1024  # 10 MB
app.add_middleware(LimitUploadSizeMiddleware, max_upload_size=MAX_UPLOAD_SIZE)
app.middleware("http")(create_auth_middleware(supabase))
setup_cors(app, config.environment)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Run startup logic here
    async with engine.begin() as conn:
        await conn.run_sync(models.Base.metadata.create_all)
    yield
    # Run shutdown logic here if needed


app.include_router(ok.router)
app.include_router(generate_palette.router)
app.include_router(whoami.router)
app.include_router(generate_palette.router)
app.include_router(alpha_signup.router)
app.include_router(save_palette.router)
app.include_router(get_palettes.router)
