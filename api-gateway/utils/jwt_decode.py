from core.config import settings
from fastapi import HTTPException, status
from jwt.exceptions import InvalidTokenError 
import jwt
from fastapi.security import HTTPBearer
from fastapi import Depends

http_bearer = HTTPBearer(auto_error=False)

def decode_jwt(
    token: str | bytes, 
    public_key: str = settings.jwt.public_key_path.read_text(), 
    algorithm: str = settings.jwt.algorithm
):
    decoded = jwt.decode(token, public_key, algorithms=["RS256"])
    return decoded

def get_current_token_payload(credentials):
    if credentials is None: raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token is missing")
    token = credentials.credentials
    try:
        payload = decode_jwt(token=token)
    except InvalidTokenError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"invalid token error: {e}")
    return payload

# def is_user(credentials = Depends(http_bearer)):
#     return get_current_token_payload(credentials, "user")

# def is_admin(credentials = Depends(http_bearer)):
#     return get_current_token_payload(credentials, "admin")