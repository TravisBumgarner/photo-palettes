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


class PushoverSettings(BaseServiceSettings):
    model_config = SettingsConfigDict(env_prefix="PUSHOVER_")
    app_token: str = ""
    user_token: str = ""


class SupabaseSettings(BaseServiceSettings):
    model_config = SettingsConfigDict(env_prefix="SUPABASE_")
    url: str = ""
    key: str = ""


class Config(BaseSettings):
    environment: str = Field(default="development", alias="ENVIRONMENT")

    supabase: SupabaseSettings = SupabaseSettings()
    pushover: PushoverSettings = PushoverSettings()
    cloudinary_url: str = ""
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
