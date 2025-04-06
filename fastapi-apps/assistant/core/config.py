from pydantic import BaseModel, PostgresDsn
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

DOCS_URL = "/api/docs/"

class RunConfig(BaseModel):
    host: str = "0.0.0.0"
    port: int = 8004

class ApiPrefix(BaseModel):
    prefix: str = "/api"
    users: str = "/assistant"

class DatabaseConfig(BaseModel):
    url: PostgresDsn
    echo: bool = False
    echo_pool: bool = False
    pool_size: int = 50
    max_overflow: int = 10

class YandexConfig(BaseModel):
    api_key: str
    folder_id: str
    model_name: str
    model_version: str
    sleep_interval: float
    doc_model_uri: str

class AuthJWT(BaseModel):
    private_key_path: Path = Path("certs/jwt-private.pem")
    public_key_path: Path = Path("certs/jwt-public.pem")
    algorithm: str = "RS256"
    access_token_expire_minutes: int = 2
    refresh_token_expire_days: int = 30

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env.template", ".env"),
        case_sensitive=False,
        env_nested_delimiter="__",
        env_prefix="APP_CONFIG__"
    )
    run: RunConfig = RunConfig()
    api: ApiPrefix = ApiPrefix()
    db: DatabaseConfig
    ya: YandexConfig
    auth_jwt: AuthJWT = AuthJWT()

settings = Settings()
