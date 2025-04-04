from fastapi import APIRouter, Depends, UploadFile, File, Request
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import HTTPBearer
from core.models import db_helper
from core.schemas import *
from services import user_service

router = APIRouter(tags=["Users Service"])
http_bearer = HTTPBearer(auto_error=False)

@router.post("/register/", summary="Регистрация пользователя")
async def register_user(user_create: RegisterConfirmSchema, session: AsyncSession = Depends(db_helper.session_getter)):
    return await user_service.register_user(user_create, session)

@router.post("/register/confirm/", summary="Подтверждение регистрации", response_model=UserSchema)
async def confirm_register_user(confirm_email: EmailCodeSchema, session: AsyncSession = Depends(db_helper.session_getter)):
    return await user_service.confirm_register_user(confirm_email, session)

@router.post("/login/", summary="Аутентификация", response_model=TokenInfo)
async def auth_user_issue_jwt(login_data: LoginSchema, session: AsyncSession = Depends(db_helper.session_getter)):
    return await user_service.auth_user_issue_jwt(login_data, session)

@router.post("/login/vk/", summary="Аутентификация по VK ID", response_model=TokenInfo)
async def auth_user_vkid(data: Request, session: AsyncSession = Depends(db_helper.session_getter), credentials = Depends(http_bearer)):
    return await user_service.auth_user_vkid(data, session, credentials)

@router.post("/refresh/", summary="Обновление токенов по refresh токену (в заголовке передавай refresh)", response_model=TokenInfo)
async def auth_refresh_jwt(credentials = Depends(http_bearer), session: AsyncSession = Depends(db_helper.session_getter)):
    return await user_service.auth_refresh_jwt(credentials, session)

@router.get("/me/", summary="Получить данные пользователя")
async def auth_user_check_self_info(credentials = Depends(http_bearer), session: AsyncSession = Depends(db_helper.session_getter)):
    return await user_service.get_user_info(credentials, session)

@router.post("/me/avatar/", summary="Изменить фото пользователя")
async def auth_user_edit_self_avatar(
    file: UploadFile = File(...),
    credentials = Depends(http_bearer),
    session: AsyncSession = Depends(db_helper.session_getter)
):
    return await user_service.update_user_avatar(credentials, file, session)

@router.delete("/me/avatar/", summary="Удалить фото пользователя")
async def auth_user_delete_avatar(
    session: AsyncSession = Depends(db_helper.session_getter),
    credentials = Depends(http_bearer)
):
    return await user_service.delete_user_avatar(credentials, session)

@router.put("/me/", summary="Обновить профиль пользователя")
async def auth_user_edit_self_info(
    update_data: UserUpdateSchema,
    session: AsyncSession = Depends(db_helper.session_getter),
    credentials = Depends(http_bearer)
):
    return await user_service.update_user_info(update_data, credentials, session)

@router.post("/password/", summary="Восстановление пароля по старому")
async def edit_password(request: PasswordEditSchema, credentials = Depends(http_bearer), session: AsyncSession = Depends(db_helper.session_getter)):
    return await user_service.edit_password(request, credentials, session)

@router.post("/forgot-password/", summary="Ввод почты для восстановления пароля")
async def forgot_password(request: EmailSchema, session: AsyncSession = Depends(db_helper.session_getter)):
    return await user_service.forgot_password(request, session)

@router.post("/reset-password/", summary="Ввод кода с новым паролем")
async def reset_password(request: ResetPasswordSchema, session: AsyncSession = Depends(db_helper.session_getter)):
    return await user_service.reset_password(request, session)
