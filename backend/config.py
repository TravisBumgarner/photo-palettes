import os
import sys
from functools import lru_cache

from dotenv import load_dotenv
from pydantic import BaseModel, Field, ValidationError

# Load .env into os.environ
load_dotenv()


class PushoverSettings(BaseModel):
    app_token: str = Field(default_factory=lambda: os.getenv("PUSHOVER_APP_TOKEN", ""))
    user_token: str = Field(default_factory=lambda: os.getenv("PUSHOVER_USER_TOKEN", ""))


class SupabaseSettings(BaseModel):
    url: str = Field(default_factory=lambda: os.getenv("SUPABASE_URL", ""))
    key: str = Field(default_factory=lambda: os.getenv("SUPABASE_KEY", ""))


class BskySettings(BaseModel):
    email: str = Field(default_factory=lambda: os.getenv("BSKY_EMAIL", ""))
    password: str = Field(default_factory=lambda: os.getenv("BSKY_PASSWORD", ""))


class InstagramSettings(BaseModel):
    username: str = Field(default_factory=lambda: os.getenv("INSTAGRAM_USERNAME", ""))
    password: str = Field(default_factory=lambda: os.getenv("INSTAGRAM_PASSWORD", ""))


def get_database_url() -> str:
    raw = os.getenv("DATABASE_URL", "postgresql://localhost:5432/photo_palettes")
    if raw.startswith("postgres://"):
        print("ruda returning better")
        return raw.replace("postgres://", "postgresql+psycopg://", 1)
    print("ruda returning raw")
    return raw


class Config(BaseModel):
    environment: str = Field(default_factory=lambda: os.getenv("ENVIRONMENT", "development"))
    database_url: str = Field(default_factory=get_database_url)
    supabase: SupabaseSettings = Field(default_factory=SupabaseSettings)
    pushover: PushoverSettings = Field(default_factory=PushoverSettings)
    bsky: BskySettings = Field(default_factory=BskySettings)
    instagram: InstagramSettings = Field(default_factory=InstagramSettings)
    cloudinary_url: str = Field(default_factory=lambda: os.getenv("CLOUDINARY_URL", ""))
    debug_cloudinary_locally: bool = Field(
        default_factory=lambda: os.getenv("DEBUG_CLOUDINARY_LOCALLY", "false").lower() == "true"
    )

    @property
    def is_production(self) -> bool:
        return self.environment.lower() == "production"


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
