from pydantic import BaseModel, PostgresDsn
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

DOCS_URL = "/api/docs/"

class RunConfig(BaseModel):
    host: str = "0.0.0.0"
    port: int = 8001

class ApiPrefix(BaseModel):
    prefix: str = "/api"
    users: str = "/users"

class RabbitConfig(BaseModel):
    user: str
    password: str
    host: str
    queue: str

class RedisConfig(BaseModel):
    host: str
    port: int
    expiration: int

class VKIDAuth(BaseModel):
    client: str

class DatabaseConfig(BaseModel):
    url: PostgresDsn
    echo: bool = False
    echo_pool: bool = False
    pool_size: int = 50
    max_overflow: int = 10

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
    auth_jwt: AuthJWT = AuthJWT()
    db: DatabaseConfig
    rabbit: RabbitConfig
    redis: RedisConfig
    vk: VKIDAuth

settings = Settings()
