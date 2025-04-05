from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import insert
from fastapi import Depends, APIRouter, HTTPException
from core.models import db_helper
from core.schemas import PlanRequest
from sqlalchemy.orm import selectinload
from typing import Dict, Any
from crud.plan import get_plan, get_today_plan

router = APIRouter(tags=["Assistant Service"])

@router.post("/plan/", summary="Получить план пользователя")
async def get_user_plan(
    data: PlanRequest,
    session: AsyncSession = Depends(db_helper.session_getter),
):
    plan = await get_plan(
        session=session,
        user_id=data.user_id,
        week=data.week,
        include_ids=True
    )

    if not plan["weekly_plan"]:
        return {"detail": "План не найден", "weekly_plan": {}}

    return plan

@router.post("/plan/today/", summary="Получить план пользователя на сегодня")
async def get_user_plan(
    data: PlanRequest,
    session: AsyncSession = Depends(db_helper.session_getter),
):
    plan = await get_today_plan(
        session=session,
        user_id=data.user_id,
        week=data.week,
        include_ids=True
    )

    if not plan.get("plan"):
        raise HTTPException(status_code=404, detail="План на сегодня не найден")

    return plan

