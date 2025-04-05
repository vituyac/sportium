from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import insert
from fastapi import Depends, APIRouter, HTTPException
from core.models import db_helper
from core.schemas import PlanRequest, MarkDoneRequest
from sqlalchemy.orm import selectinload
from typing import Dict, Any
from crud.plan import get_plan, get_today_plan, mark_item_done

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

@router.post("/plan/mark-done/", summary="Отметить элемент как выполненный")
async def mark_done_route(
    data: MarkDoneRequest,
    session: AsyncSession = Depends(db_helper.session_getter)
):
    return await mark_item_done(
        session=session,
        user_id=data.user_id,
        item_type=data.item_type,
        item_id=data.item_id,
        week=data.week
    )

