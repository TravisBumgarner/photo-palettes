from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from sqlalchemy import select
from supabase import Client, create_client

from backend.config import get_config
from backend.database import AsyncSessionLocal, engine, models
from backend.middleware import create_auth_middleware, setup_cors

config = get_config()

supabase: Client = create_client(config.supabase.url, config.supabase.key)

app = FastAPI()

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
async def insert_and_get_color():
    async with AsyncSessionLocal() as session:
        # Insert a color
        color = models.Color(name="magenta")
        session.add(color)
        await session.commit()

        # Get the color back
        stmt = select(models.Color).where(models.Color.name == "magenta")
        result = await session.execute(stmt)
        fetched_color = result.scalar_one()

        return {"id": fetched_color.id, "name": fetched_color.name}


@app.get("/whoami")
async def whoami(request: Request):
    return {"message": "Hello, " + request.state.user.email}
