from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from backend.config import get_config

config = get_config()

# ✅ Update with your real DB credentials
DATABASE_URL = f"postgresql+asyncpg://{config.postgres.user}:{config.postgres.password}@{config.postgres.host}:{config.postgres.port}/{config.postgres.database}"

# Create an async engine for PostgreSQL
engine = create_async_engine(DATABASE_URL, echo=True)

# Async session maker (like session factory)
AsyncSessionLocal = async_sessionmaker(bind=engine, expire_on_commit=False)


# Declarative base class for models
class Base(DeclarativeBase):
    pass
