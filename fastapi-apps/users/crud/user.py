import os
import shutil
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from fastapi import HTTPException, status
from core.models import User
from core.schemas.user import RegisterConfirmSchema
from utils.jwt_auth import hash_password, generate_code
from utils.create_avatar import generate_avatar

UPLOAD_DIR = "media/"
os.makedirs(UPLOAD_DIR, exist_ok=True)

async def check_user_not_exists(user_create: RegisterConfirmSchema, session: AsyncSession):
    if user_create.password != user_create.confirm:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Пароли не совпадают")

    stmt = select(User).where(
        or_(
            User.username == user_create.username,
            User.email == user_create.email
        )
    )
    result = await session.execute(stmt)
    user = result.scalars().first()
    if user:
        if user.username == user_create.username:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Имя пользователя уже занято")
        if user.email == user_create.email:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Пользователь с таким email уже существует")

async def create_user(user_create, session: AsyncSession):
    user_data = user_create.model_dump(exclude={"confirm", "code"})
    user_data["password"] = hash_password(user_create.password)
    user_data["image"] = generate_avatar(user_data["username"][:2])
    
    user = User(**user_data)
    session.add(user)
    await session.commit()
    return user

async def create_user_vk(user_data, session: AsyncSession):
    password = user_data["password"]
    user_data["password"] = hash_password(password)
    user = User(**user_data)
    session.add(user)
    await session.commit()
    return user

async def update_user_fio(user_data, user, session: AsyncSession):
    user.first_name = user_data.first_name
    user.middle_name = user_data.middle_name
    user.last_name = user_data.last_name
    user.date_of_birth = user_data.date_of_birth
    user.height = user_data.height
    user.weight = user_data.weight
    user.training_goal = user_data.training_goal
    user.gender = user_data.gender

    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user

async def is_email_registered(email: str, session: AsyncSession) -> bool:
    stmt = select(User).where(User.email == email)
    result = await session.scalar(stmt)
    return result is not None

async def user_edit_avatar(file, user, session: AsyncSession) -> str:
    file_extension = file.filename.split(".")[-1]
    file_path = f"{UPLOAD_DIR}{generate_code(16)}{user.id}.{file_extension}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    user.image = f"https://crocodailo.ru/api/users/{file_path}"
    session.add(user)
    await session.commit()
    return user.image

async def password_reset(email: str, password: str, session: AsyncSession) -> bool:
    stmt = select(User).where(User.email == email)
    user = await session.scalar(stmt)
    if not user:
        return False
    user.password = hash_password(password)
    await session.commit()
    return True

async def reset_user_avatar(user, session: AsyncSession) -> str:
    user.image = generate_avatar(user.username[:2])
    session.add(user)
    await session.commit()
    return user.image

async def set_user_vk_id(user, vk_id, session: AsyncSession) -> str:
    user.vk_id = vk_id
    session.add(user)
    await session.commit()
    return user

async def get_user(
    session: AsyncSession,
    user_id: str = None,
    username: str = None,
    email: str = None,
    vk_id: str = None
):
    stmt = select(User)
    
    if user_id:
        stmt = stmt.where(User.id == user_id)
    elif username:
        stmt = stmt.where(User.username == username)
    elif email:
        stmt = stmt.where(User.email == email)
    elif vk_id:
        stmt = stmt.where(User.vk_id == vk_id)

    result = await session.execute(stmt)
    user = result.scalars().first()
    return user
