from enum import Enum
from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict
class BaseServiceSettings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', extra='ignore')

class PostgresSettings(BaseServiceSettings):
    model_config = SettingsConfigDict(env_prefix="POSTGRES_")
    username: str
    password: str
    host: str
    port: int
    database: str

class Config(BaseSettings):
    environment: str
    postgres: PostgresSettings = PostgresSettings()

    model_config = SettingsConfigDict(env_file='.env', extra='ignore')

config = Config()