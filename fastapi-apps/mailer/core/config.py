from pydantic import BaseModel, PostgresDsn
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

class SMTPConfig(BaseModel):
    server: str
    port: int
    user: str
    password: str
    email: str

class RabbitConfig(BaseModel):
    user: str
    password: str
    host: str
    queue: str

class RunConfig(BaseModel):
    host: str = "0.0.0.0"
    port: int = 8002
   
class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env.template", ".env"),
        case_sensitive=False,
        env_nested_delimiter="__",
        env_prefix="APP_CONFIG__"
    )
    run: RunConfig = RunConfig()
    smtp: SMTPConfig
    rabbit: RabbitConfig

settings = Settings()
