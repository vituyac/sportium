from fastapi import APIRouter
from core.config import settings
from .users import router as users_router
from .assistant import router as assistant_router

router = APIRouter()

router.include_router(users_router, prefix=settings.api.users)
router.include_router(assistant_router, prefix=settings.api.assistant)