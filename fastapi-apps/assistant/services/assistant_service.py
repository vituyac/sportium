from sqlalchemy.ext.asyncio import AsyncSession
from core.models import WeekTypeEnum, db_helper
from core.schemas import UserSchema
from services.rag.main import prepare_ai_request
from crud.plan import *
import json

import logging
logger = logging.getLogger(__name__)

async def generate_weekly_plan_for_user(user_data, activity, week):
    """
    Упрощённая функция, которая:
    1. Берёт сессию из async-генератора.
    2. Генерирует / редактирует план.
    3. Сохраняет план в БД.
    """
    # Получаем "контекст" (наш async-генератор)
    session_gen = db_helper.session_getter()
    # Забираем первую (и единственную) выдачу - объект сессии
    session = await session_gen.__anext__()
    try:
        personal_data = {
            "sex": user_data.sex,
            "age": user_data.age,
            "height": user_data.height,
            "weight": user_data.weight,
            "training_goal": user_data.training_goal,
        }

        message = user_data.message or None
        week_type = WeekTypeEnum.this_week if week == "this" else WeekTypeEnum.next_week

        if activity == "editPlan":
            temp_json = await get_plan(session, user_data.id, week_type)
            plan = await prepare_ai_request(activity, personal_data, temp_json, message)
        elif activity == "createTodayPlan":
            plan = await prepare_ai_request(activity, personal_data)
        else:
            temp_json = await get_plan(session, user_data.id, WeekTypeEnum.next_week)
            plan = await prepare_ai_request(activity, personal_data, temp_json)

        if isinstance(plan, str):
            plan = json.loads(plan)

        # Сохраняем в БД
        await save_weekly_plan_to_db(user_data.id, plan, week_type, session)

        return plan

    except Exception as e:
        # Пробрасываем ошибку, чтобы обработать её вне функции
        raise e
    finally:
        # Закрываем наш async-генератор
        await session_gen.aclose()
    