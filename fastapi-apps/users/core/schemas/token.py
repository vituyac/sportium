from pydantic import BaseModel

class TokenInfo(BaseModel):
    access: str
    refresh: str
    token_type: str = "Bearer"