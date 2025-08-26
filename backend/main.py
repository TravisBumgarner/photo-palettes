import os
from contextlib import asynccontextmanager

import sentry_sdk
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from supabase import Client, create_client

from config import get_config
from database import engine, models
from middleware.auth import create_auth_middleware
from middleware.cors import setup_cors
from middleware.filesize import LimitUploadSizeMiddleware
from routes import favorites, feature_requests, ok, palettes, users

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
setup_cors(app, config.is_production)

# Mount the uploads directory for static file serving
uploads_dir = os.path.join(os.path.dirname(__file__), "uploads")

os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Run startup logic here
    models.Base.metadata.create_all(bind=engine)
    yield
    # Run shutdown logic here if needed


app.include_router(ok.router)
app.include_router(users.users_router, prefix="/users")
app.include_router(palettes.palettes_router, prefix="/palettes")
app.include_router(feature_requests.feature_requests_router, prefix="/feature_requests")
app.include_router(favorites.favorites_router, prefix="/favorites")
