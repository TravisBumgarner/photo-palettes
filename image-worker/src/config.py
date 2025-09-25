import sys
from functools import lru_cache

from pydantic import Field, ValidationError, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class BaseServiceSettings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @field_validator("*", mode="after")
    def not_none_or_empty(cls, v: str | None, info):
        if not str(v).strip():
            raise ValueError(f"{cls.__name__}.{info.field_name} must not be empty")
        return v


class TwitterSettings(BaseServiceSettings):
    model_config = SettingsConfigDict(env_prefix="TWITTER_")

    api_key: str = ""
    api_key_secret: str = ""
    access_token: str = ""
    access_token_secret: str = ""
    client_id: str = ""
    client_secret: str = ""


class BlueskySettings(BaseServiceSettings):
    model_config = SettingsConfigDict(env_prefix="BLUESKY_")

    email: str = ""
    password: str = ""


class InstagramSettings(BaseServiceSettings):
    model_config = SettingsConfigDict(env_prefix="INSTAGRAM_")

    username: str = ""
    password: str = ""


class CloudinarySettings(BaseServiceSettings):
    model_config = SettingsConfigDict(env_prefix="CLOUDINARY_")

    url: str = ""


class Config(BaseSettings):
    environment: str = Field(default="development", alias="ENVIRONMENT")

    twitter: TwitterSettings = TwitterSettings()
    bluesky: BlueskySettings = BlueskySettings()
    instagram: InstagramSettings = InstagramSettings()
    cloudinary: CloudinarySettings = CloudinarySettings()

    debug_cloudinary_locally: bool = Field(default=False)

    @property
    def is_production(self) -> bool:
        return self.environment.lower() == "production"

    database_url: str = Field(default="postgresql://localhost:5432/photo_palettes")

    # SqlAlchemy expects postgresql://, but postgres:// is what we get from Heroku.
    @field_validator("database_url")
    def convert_postgres_url(cls, v: str) -> str:  # noqa: N805
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
