from fastapi import WebSocket, WebSocketDisconnect, Depends
from core.models import db_helper
from core.schemas import UserSchema
from sqlalchemy.ext.asyncio import AsyncSession
from utils.ws_manager import manager
from services.assistant_service import generate_weekly_plan_for_user
from fastapi import APIRouter
import json

from fastapi import WebSocket, WebSocketDisconnect, APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from utils.jwt_decode import get_current_token_payload
from core.schemas import UserSchema
from core.models import db_helper
import json, asyncio

router = APIRouter()

def register_ws_routes(app):
    @app.websocket("/ws/plan/")
    async def websocket_endpoint(websocket: WebSocket):
        await manager.connect(websocket)
        session = await db_helper.session_getter()
        try:
            data = await websocket.receive_json()
            access_token = data.get("access")
            act = data.get("act")
            week = data.get("week", "this")
            message = data.get("message", None)

            if not access_token or not act:
                await manager.send_json({"detail": "Missing access token, act or week"}, websocket)
                manager.disconnect(websocket)
                return

            try:
                payload = get_current_token_payload(access_token)
                required_fields = ["age", "height", "weight", "training_goal", "sex"]
                missing_fields = [field for field in required_fields if payload.get(field) is None]

                if missing_fields:
                    await manager.send_json({"detail": "Вы не до конца заполнили профиль"}, websocket)
                    await manager.disconnect(websocket)
                    return
                
                user_data = UserSchema(
                    id=payload["sub"],
                    age=payload["age"],
                    height=str(payload["height"]),
                    weight=str(payload["weight"]),
                    training_goal=payload["training_goal"],
                    sex=payload["sex"],
                    message=message,
                )
                
            except Exception:
                await manager.send_json({"detail": "Ошибка при обработке токена"}, websocket)
                await manager.disconnect(websocket)
                return

            try:
                plan = await generate_weekly_plan_for_user(
                    user_data=user_data,
                    activity=act,
                    week=week,
                    session=session
                )
                await manager.send_json({"detail": "План успешно сгенерирован"}, websocket)
                await manager.disconnect(websocket)

            except Exception:
                await manager.send_json({"detail": "Ошибка при генерации плана"}, websocket)
                await manager.disconnect(websocket)
                return

        except WebSocketDisconnect:
            pass
        except Exception as e:
            await manager.send_json({"detail": {str(e)}}, websocket)
            await manager.disconnect(websocket)