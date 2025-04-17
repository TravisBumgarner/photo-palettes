import sys
from functools import lru_cache

from pydantic import Field, ValidationError
from pydantic_settings import BaseSettings, SettingsConfigDict


class BaseServiceSettings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


class PostgresSettings(BaseServiceSettings):
    model_config = SettingsConfigDict(env_prefix="POSTGRES_")
    database_url: str


class SupabaseSettings(BaseServiceSettings):
    model_config = SettingsConfigDict(env_prefix="SUPABASE_")
    url: str
    key: str


class Config(BaseSettings):
    environment: str
    postgres: PostgresSettings = Field(default_factory=PostgresSettings)
    supabase: SupabaseSettings = Field(default_factory=SupabaseSettings)

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache()
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
