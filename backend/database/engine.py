from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from config import get_config

config = get_config()

# Synchronous PostgreSQL connection URL
# Create an engine for synchronous PostgreSQL connection
engine = create_engine(config.database_url, echo=True)

# Synchronous session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Declarative base for models
class Base(DeclarativeBase):
    pass
