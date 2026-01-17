from __future__ import annotations

from functools import lru_cache

from pydantic import BaseSettings, Field, PostgresDsn, SecretStr


class Settings(BaseSettings):
    app_name: str = "Redblade Legacy API"
    debug: bool = False
    database_url: PostgresDsn = Field(..., env="DATABASE_URL")
    jwt_secret: SecretStr = Field(..., env="JWT_SECRET_KEY")
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24

    class Config:
        env_file = ".env"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
