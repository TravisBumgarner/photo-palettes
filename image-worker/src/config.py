import sys
from functools import lru_cache

from pydantic import Field, ValidationError, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class BaseServiceSettings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


class BskySettings(BaseServiceSettings):
    model_config = SettingsConfigDict(env_prefix="BSKY_")
    email: str = Field(default="")
    password: str = Field(default="")


class InstagramSettings(BaseServiceSettings):
    model_config = SettingsConfigDict(env_prefix="INSTAGRAM_")
    username: str = Field(default="")
    password: str = Field(default="")


class Config(BaseSettings):
    environment: str = Field(default="development", alias="ENVIRONMENT")
    bsky: BskySettings = Field(default_factory=lambda: BskySettings())
    instagram: InstagramSettings = Field(default_factory=lambda: InstagramSettings())

    @property
    def is_production(self) -> bool:
        return self.environment.lower() == "production"

    database_url: str = Field(default="postgresql://localhost:5432/photo_palettes")

    # SqlAlchemy expects postgresql://, but postgres:// is what we get from Heroku.
    @field_validator("database_url")
    def convert_postgres_url(cls, v: str) -> str:  # noqa: N805 Unsure why cls isn't being recognized.
        if v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql://", 1)
        return v


@lru_cache
def get_config() -> Config:
    try:
        return Config()
    except ValidationError as e:
        print("🚨 Configuration error:")  # noqa: T201
        for err in e.errors():
            loc = " -> ".join(str(i) for i in err["loc"])
            msg = err["msg"]
            print(f"  • {loc}: {msg}")  # noqa: T201
        sys.exit(1)
