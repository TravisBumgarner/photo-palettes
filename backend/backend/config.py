import sys
from functools import lru_cache

from pydantic import Field, ValidationError, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class BaseServiceSettings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


class PushoverSettings(BaseServiceSettings):
    model_config = SettingsConfigDict(env_prefix="PUSHOVER_")
    app_token: str
    user_token: str


class SupabaseSettings(BaseServiceSettings):
    model_config = SettingsConfigDict(env_prefix="SUPABASE_")
    url: str
    key: str


class Config(BaseSettings):
    environment: str
    database_url: str
    supabase: SupabaseSettings = Field(default_factory=SupabaseSettings)
    pushover: PushoverSettings = Field(default_factory=PushoverSettings)
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # SqlAlchemy expects postgresql://, but postgres:// is what we get from Heroku.
    @field_validator("database_url")
    def convert_postgres_url(cls, v: str) -> str:
        if v.startswith("postgres://"):
            return v.replace("postgres://", "postgresql://", 1)
        return v


@lru_cache
def get_config() -> Config:
    try:
        return Config()
    except ValidationError as e:
        print("🚨 Configuration error:")
        for err in e.errors():
            loc = " -> ".join(str(i) for i in err["loc"])
            msg = err["msg"]
            print(f"  • {loc}: {msg}")
        sys.exit(1)
