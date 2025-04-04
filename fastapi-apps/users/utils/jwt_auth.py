import jwt, bcrypt
from datetime import timedelta, datetime
from core.config import settings
import random
import string

def encode_jwt(
    payload: dict, 
    private_key: str = settings.auth_jwt.private_key_path.read_text(), 
    algorithm: str = settings.auth_jwt.algorithm,
    expire_minutes: int = settings.auth_jwt.access_token_expire_minutes,
    expire_timedelta: timedelta | None = None
):
    to_encode = payload.copy()
    now = datetime.utcnow()
    if expire_timedelta:
        expire = now + expire_timedelta
    else:
        expire = now + timedelta(minutes=expire_minutes)
    to_encode.update(exp=expire, iat=now)
    encoded = jwt.encode(to_encode, private_key, algorithm=algorithm)
    return encoded
    
def decode_jwt(
    token: str | bytes, 
    public_key: str = settings.auth_jwt.public_key_path.read_text(), 
    algorithm: str = settings.auth_jwt.algorithm
):
    decoded = jwt.decode(token, public_key, algorithms=[algorithm])
    return decoded

def hash_password(password: str) -> bytes:
    salt = bcrypt.gensalt()
    pwd_bytes: bytes = password.encode()
    return bcrypt.hashpw(pwd_bytes, salt)

def validate_password(password: str, hashed_password: bytes) -> bool:
    return bcrypt.checkpw(password=password.encode(), hashed_password=hashed_password)

def generate_code(length=32, letters=True):
    characters = (string.ascii_letters + string.digits) if letters else string.digits
    return ''.join(random.choice(characters) for _ in range(length))
