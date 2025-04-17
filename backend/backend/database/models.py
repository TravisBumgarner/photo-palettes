from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from .engine import Base


class Color(Base):
    __tablename__ = "colors"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String, unique=True)
    hex: Mapped[str] = mapped_column(String, unique=False, default="#000000")
