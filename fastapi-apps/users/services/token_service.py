from core.schemas.user import UserSchema
from utils import jwt_auth
from jwt.exceptions import InvalidTokenError 
from fastapi import HTTPException, status
from core.config import settings
from datetime import timedelta
from .user_service import *
from core.schemas import UserSchema, LoginSchema
from utils.exceptions import AppError
from datetime import date

TOKEN_TYPE_FIELD = "type"
ACCESS_TOKEN_TYPE = "access"
REFRESH_TOKEN_TYPE = "refresh"

#################### Аутентификация (сверка логина и пароля)

async def validate_auth_user(user_data: LoginSchema, session):
    unauthed_exc = AppError(error_code="INVALID_EMAIL_OR_PASSWORD", status_code=502)
    
    user = await get_user(session, email=user_data.email)
    if not user:
        raise unauthed_exc
    if not jwt_auth.validate_password(password=user_data.password, hashed_password=user.password):
        raise unauthed_exc
    if not user.is_active:
        raise AppError(error_code="USER_INACTIVE", status_code=403)
    return user

#################### Создание токенов

def create_jwt(
    token_type: str,
    token_data: dict,
    expire_minutes: int = settings.auth_jwt.access_token_expire_minutes,
    expire_timedelta: timedelta | None = None
) -> str:
    jwt_payload = {TOKEN_TYPE_FIELD: token_type}
    jwt_payload.update(token_data)
    return jwt_auth.encode_jwt(payload=jwt_payload, expire_minutes=expire_minutes, expire_timedelta=expire_timedelta)

def create_access_token(user: UserSchema) -> str:
    jwt_payload = {
        "sub": str(user.id),
        "username": user.username,
        "sex": user.gender if user.gender else None,
        "age": (
            date.today().year - user.date_of_birth.year
            - ((date.today().month, date.today().day) < (user.date_of_birth.month, user.date_of_birth.day))
            if user.date_of_birth else None
        ),
        "height": user.height if user.height else None,
        "weight": user.weight if user.weight else None,
        "training_goal": user.training_goal if user.training_goal else None
    }
    return create_jwt(token_type=ACCESS_TOKEN_TYPE, token_data=jwt_payload, expire_minutes=settings.auth_jwt.access_token_expire_minutes)

def create_refresh_token(user: UserSchema) -> str:
    jwt_payload = {
        "sub": str(user.id)
    }
    return create_jwt(token_type=REFRESH_TOKEN_TYPE, token_data=jwt_payload, expire_timedelta=timedelta(days=settings.auth_jwt.refresh_token_expire_days))

#################### Получение payload по токену

def get_current_token_payload(credentials) -> UserSchema:
    if credentials is None: raise AppError(error_code="TOKEN_IS_MISSING", status_code=401)
    token = credentials.credentials
    try:
        payload = jwt_auth.decode_jwt(token=token)
    except InvalidTokenError as e:
        raise AppError(error_code="TOKEN_INVALID", status_code=401)
    return payload

#################### Проверка токена на тип (access или refresh)

def validate_token_type(payload: dict, token_type: str) -> bool:
    current_token_type = payload.get(TOKEN_TYPE_FIELD)
    if current_token_type == token_type:
        return True
    raise AppError(error_code="INVALID_TOKEN_TYPE", status_code=401)

#################### Получение пользователя по sub

async def get_user_by_token_sub(payload: dict, session) -> UserSchema:
    user_id: str | None = payload.get("sub")

    if user := await get_user(session, user_id=int(user_id)):
        return user
    raise AppError(error_code="TOKEN_INVALID", status_code=401)

#################### Получение пользователя по токену

async def user_getter_from_token(token_type: str, credentials, session = None):
    payload = get_current_token_payload(credentials)
    validate_token_type(payload, token_type)
    return await get_user_by_token_sub(payload, session)

#################### Получение активного пользователя

async def get_current_active_auth_user(token_type: str, credentials, session):
    user = await user_getter_from_token(token_type, credentials, session)
    if user.is_active:
        return user
    raise AppError(error_code="TOKEN_INVALID", status_code=403)



