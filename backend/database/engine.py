from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase

from config import get_config

config = get_config()

# Engine with connection pooling
db_engine = create_engine(
    config.database_url,
    echo=False,  # Less logging
    pool_size=5,  # persistent connections per worker
    max_overflow=10,  # extra temporary connections allowed
    pool_timeout=30,  # seconds to wait before giving up
    pool_recycle=1800,  # recycle connections every 30 min
)


class Base(DeclarativeBase):
    pass
