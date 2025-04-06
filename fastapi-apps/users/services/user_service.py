import json, requests
from json import loads
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from core.schemas import *
from crud.user import *
from utils.redis_client import RedisClient
from utils.rabbit_client import rabbitmq_client
from utils.jwt_auth import generate_code, hash_password, validate_password
from .token_service import create_access_token, create_refresh_token
from . import token_service as token_crud
from core.config import settings
from utils.calculate_fat import *
import logging

from utils.exceptions import AppError

async def register_user(user_create: RegisterConfirmSchema, session: AsyncSession):
    await check_user_not_exists(user_create, session)

    email_in_redis = await RedisClient.get_data(user_create.email)
    if email_in_redis:
        user_data_in_redis = json.loads(email_in_redis)
        if user_data_in_redis.get("username") == user_create.username:
            pass
        else:
            raise AppError(error_code="USER_EXIST_EMAIL", status_code=409)
    else:
        username_in_redis = await RedisClient.get_data(user_create.username)
        if username_in_redis: raise AppError(error_code="USER_EXIST_USERNAME", status_code=409)

    code = generate_code(6, False)
    user_data = user_create.model_dump(exclude={"confirm", "code"})
    data = {**user_data, "code": code}
    await RedisClient.set_data(user_create.email, json.dumps(data))
    await RedisClient.set_data(user_create.username, "register_lock")
    await rabbitmq_client.send_message("mailer", {"email": user_create.email, "type": "1", "code": code})
    return {"detail": "Введите код подтверждения, отправленный на ваш email"}

async def confirm_register_user(confirm_email: EmailCodeSchema, session: AsyncSession):
    raw_data = await RedisClient.get_data(confirm_email.email)
    if not raw_data:
        raise AppError(error_code="CODE_EXPIRED_OR_INVALID", status_code=400)
    data = loads(raw_data)
    if data.get("code") is None or data.get("code") != confirm_email.code:
        raise AppError(error_code="CODE_EXPIRED_OR_INVALID", status_code=400)
    user = await create_user(RegisterSchema(**data), session)
    await RedisClient.delete_data(confirm_email.email)
    return user

async def auth_user_issue_jwt(login_data: LoginSchema, session: AsyncSession, user = None):
    if not user: user = await token_crud.validate_auth_user(login_data, session)
    access_token = create_access_token(user)
    refresh_token = create_refresh_token(user)
    return TokenInfo(access=access_token, refresh=refresh_token)

async def auth_refresh_jwt(credentials, session: AsyncSession):
    user = await token_crud.user_getter_from_token(token_crud.REFRESH_TOKEN_TYPE, credentials, session)
    access_token = create_access_token(user)
    refresh_token = create_refresh_token(user)
    return TokenInfo(access=access_token, refresh=refresh_token)

async def get_user_info(credentials, session: AsyncSession):
    user = await token_crud.get_current_active_auth_user(
        token_crud.ACCESS_TOKEN_TYPE, credentials, session
    )

    user_dict = user.__dict__.copy()

    if isinstance(user_dict.get("gender"), str):
        user_dict["gender"] = GenderEnum(user_dict["gender"])

    user_schema = UserSchema.model_validate(user_dict)
    result = user_schema.model_dump()

    age = None
    if result.get("date_of_birth"):
        age = calculate_age(result["date_of_birth"])
        result["age"] = age

    if result.get("weight") and result.get("height"):
        try:
            bmi = calculate_bmi(result["weight"], result["height"])
            result["imt"] = bmi

            if age and result.get("gender"):
                result["fat"] = calculate_body_fat(bmi, age, result["gender"])
            else:
                result["fat"] = None
        except Exception:
            result["imt"] = None
            result["fat"] = None
    else:
        result["imt"] = None
        result["fat"] = None

    return result

async def update_user_avatar(credentials, file, session: AsyncSession):
    user = await token_crud.get_current_active_auth_user(token_crud.ACCESS_TOKEN_TYPE, credentials, session)
    image = await user_edit_avatar(file, user, session)
    return ImageSchema(image=image)

async def delete_user_avatar(credentials, session: AsyncSession):
    user = await token_crud.get_current_active_auth_user(token_crud.ACCESS_TOKEN_TYPE, credentials, session)
    image = await reset_user_avatar(user, session)
    return ImageSchema(image=image)

async def update_user_info(update_data: UserUpdateSchema, credentials, session: AsyncSession):
    user = await token_crud.get_current_active_auth_user(token_crud.ACCESS_TOKEN_TYPE, credentials, session)
    updated_user = await update_user_fio(update_data, user, session)
    token = create_access_token(updated_user)
    return {"access": token}

async def forgot_password(request: EmailSchema, session: AsyncSession):
    if not (await is_email_registered(request.email, session)):
        raise AppError(error_code="EMAIL_NOT_FOUND", status_code=404)
    code = generate_code()
    await RedisClient.set_data(request.email, code)
    await rabbitmq_client.send_message("mailer", {"email": request.email, "type": "2", "code": code})
    return {"detail": "Код отправлен на email"}

async def reset_password(request: ResetPasswordSchema, session: AsyncSession):
    stored_code = await RedisClient.get_data(request.email)
    if stored_code is None or stored_code != request.code:
        raise AppError(error_code="CODE_EXPIRED_OR_INVALID", status_code=400)
    if request.password != request.confirm:
        raise AppError(error_code="PASSWORDS_NOT_MATCH", status_code=400)
    q = await password_reset(request.email, request.password, session)
    await RedisClient.delete_data(request.email)
    return {"detail": "Пароль успешно обновлён"} if q else {"detail": "Произошла ошибка при изменении пароля"}

async def edit_password(request: PasswordEditSchema, credentials, session: AsyncSession):
    user = await token_crud.get_current_active_auth_user(token_crud.ACCESS_TOKEN_TYPE, credentials, session)
    if not validate_password(password=request.password, hashed_password=user.password):
        raise AppError(error_code="INVALID PASSWORD", status_code=400)
    if request.new_password != request.confirm:
        raise AppError(error_code="PASSWORDS_NOT_MATCH", status_code=400)
    q = await password_reset(user.email, request.new_password, session)
    return {"detail": "Пароль успешно обновлён"} if q else {"detail": "Произошла ошибка при изменении пароля"}

async def auth_user_vkid(request, session, credentials):
    auth_data = await request.json()
    try:
        vk_response = requests.post(
            "https://id.vk.com/oauth2/user_info",
            headers={
                "Authorization": f"Bearer {auth_data.get("access_token")}",
                "Content-Type": "application/json"
            },
            json={
                "client_id": settings.vk.client
            }
        )

        user_info = vk_response.json().get("user", {})
        user_id = int(user_info.get("user_id"))
        logger = logging.getLogger(__name__)
        logger.warning(f"VK NAME DEBUG: {user_info.get('first_name')} {user_info.get('last_name')}")
        vk_user = await get_user(session, vk_id=user_id)

        if credentials:
            if vk_user: raise AppError(error_code="USER_EXIST_VK", status_code=400)
            auth_user = await token_crud.get_current_active_auth_user(token_crud.ACCESS_TOKEN_TYPE, credentials, session)
            await set_user_vk_id(auth_user, user_id, session)
            return await auth_user_issue_jwt(None, session, auth_user)


        if not vk_user:
            if not (await is_email_registered(user_info.get("email"), session)):
                user_data = {"username": f"sportiumuser{str(user_id)[:2] + str(user_id)[-2:]}"}
                user_data["first_name"] = user_info.get("first_name")
                user_data["last_name"] = user_info.get("last_name")
                user_data["vk_id"] = user_id
                user_data["email"] = user_info.get("email")
                user_data["image"] = user_info.get("avatar")

                password = generate_code(12, False)
                user_data["password"] = password
                logger.warning(f"VK NAME DEBUG: {user_data}")
                user = await create_user_vk(user_data, session)
                logger.warning(f"VK NAME DEBUG: {user.first_name}")
                if user:
                    await rabbitmq_client.send_message("mailer", {"email": user.email, "type": "3", "code": f"username: {user.username}, password: {password}"})
                    login_schema = LoginSchema(email=user.email, password=password)
                    return await auth_user_issue_jwt(login_schema, session)
                else:
                    raise AppError(error_code="VK_ERROR", status_code=400)
            else:
                email_user = await get_user(session, email=user_info.get("email"))
                await set_user_vk_id(email_user, user_id, session)
                return await auth_user_issue_jwt(None, session, email_user)
        else:
            return await auth_user_issue_jwt(None, session, vk_user)
    except Exception as e:
        raise AppError(error_code="VK_SERVICE_NOT_AVAILABLE", status_code=502)

