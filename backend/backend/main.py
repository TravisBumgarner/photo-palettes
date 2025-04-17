from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, Request
from sqlalchemy import select
from sqlalchemy.orm import Session
from supabase import Client, create_client

from backend.config import get_config
from backend.database import engine, models
from backend.database.deps import get_db
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
def read_root():
    return {"message": "Hello, World!"}


# @app.get("/testdb")
# def insert_and_get_color(db: Session = Depends(get_db)):
#     print("inserting color")
#     color = models.Color(name="magenta")
#     db.add(color)
#     db.commit()

#     # Get the color back
#     stmt = select(models.Color).where(models.Color.name == "magenta")
#     result = db.execute(stmt)
#     fetched_color = result.scalar_one()

#     return {"id": fetched_color.id, "name": fetched_color.name}


@app.get("/whoami")
async def whoami(request: Request):
    return {"message": "Hello, " + request.state.user.email}
