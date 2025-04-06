from sqlalchemy.ext.asyncio import AsyncSession
from core.models import WeekTypeEnum, db_helper
from core.schemas import UserSchema
from services.rag.main import prepare_ai_request
from crud.plan import *
import json

import logging
logger = logging.getLogger(__name__)

async def generate_weekly_plan_for_user(user_data, activity, week, websocket=None):
    async with db_helper.session_getter() as session:
        # По желанию можно использовать try/except на весь блок,
        # но важно избегать лишней вложенности.
        try:
            if websocket:
                await websocket.send_json({"detail": "📥 Начинаем генерацию плана..."})

            # Формируем персональные данные
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
                # Редактирование существующего плана
                if websocket:
                    await websocket.send_json({"detail": "📂 Загружаем текущий план..."})

                temp_json = await get_plan(session, user_data.id, week_type)

                if websocket:
                    await websocket.send_json({"detail": "🤖 Отправляем в AI для редактирования..."})

                plan = await prepare_ai_request(activity, personal_data, temp_json, message)

            elif activity == "createTodayPlan":
                # Генерация плана на сегодня
                if websocket:
                    await websocket.send_json({"detail": "📅 Генерация плана на сегодня..."})

                plan = await prepare_ai_request(activity, personal_data)

            else:
                # Генерация нового плана (по умолчанию — на следующую неделю)
                if websocket:
                    await websocket.send_json({"detail": "📂 Загружаем план следующей недели..."})

                temp_json = await get_plan(session, user_data.id, WeekTypeEnum.next_week)

                if websocket:
                    await websocket.send_json({"detail": "🤖 Генерация нового плана..."})

                plan = await prepare_ai_request(activity, personal_data, temp_json)

            # Если AI вернул строку — преобразуем её в JSON
            if isinstance(plan, str):
                plan = json.loads(plan)

            if websocket:
                await websocket.send_json({"detail": "💾 Сохраняем план в базу..."})

            # Сохраняем в БД
            await save_weekly_plan_to_db(user_data.id, plan, week_type, session)

            if websocket:
                await websocket.send_json({"detail": "✅ План успешно сгенерирован!"})

        except Exception as e:
            if websocket:
                try:
                    await websocket.send_json({"detail": f"❌ Ошибка генерации: {str(e)}"})
                except:
                    # Если при отправке сообщения об ошибке тоже случился разрыв, просто игнорируем
                    pass
            # Пробрасываем исключение дальше, чтобы верхний уровень тоже мог его обработать
            raise
    