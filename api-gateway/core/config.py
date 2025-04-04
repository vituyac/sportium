from pydantic import BaseModel
from pathlib import Path
from pydantic_settings import BaseSettings

SERVICES = {
    "users": "http://users-service:8001"
}

class ApiPrefix(BaseModel):
    users: str = "/api/users"

class RunConfig(BaseModel):
    host: str = "0.0.0.0"
    port: int = 8000

class DecodeJWT(BaseModel):
    public_key_path: Path = Path("certs/jwt-public.pem")
    algorithm: str = "RS256"
    
class Settings(BaseSettings):
    run: RunConfig = RunConfig()
    api: ApiPrefix = ApiPrefix()
    jwt: DecodeJWT = DecodeJWT()

settings = Settings()
