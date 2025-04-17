from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from backend.config import get_config

config = get_config()

# Synchronous PostgreSQL connection URL
DATABASE_URL = f"postgresql://{config.postgres.user}:{config.postgres.password}@{config.postgres.host}:{config.postgres.port}/{config.postgres.database}"

# Create an engine for synchronous PostgreSQL connection
engine = create_engine(DATABASE_URL, echo=True)

# Synchronous session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Declarative base for models
class Base(DeclarativeBase):
    pass
