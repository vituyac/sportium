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
    @app.websocket('/ws/plan/')
    async def websocket_endpoint(websocket: WebSocket):
        await websocket.accept()

        try:
            initial_data = await websocket.receive_json()
            access_token = initial_data.get("access")
            act = initial_data.get("act")
            week = initial_data.get("week", "this")
            message = initial_data.get("message", None)

            if not access_token or not act:
                await websocket.send_json({"detail": "Missing access token or act"})
                await websocket.close()
                return

            try:
                payload = get_current_token_payload(access_token)
                required_fields = ["age", "height", "weight", "training_goal", "sex"]
                missing_fields = [field for field in required_fields if payload.get(field) is None]

                if missing_fields:
                    await websocket.send_json({"detail": "Вы не до конца заполнили профиль"})
                    await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
                    return

            except Exception:
                await websocket.send_json({"detail": "Ошибка при обработке токена"})
                await websocket.close()
                return

            user_data = UserSchema(
                id=payload["sub"],
                age=payload["age"],
                height=str(payload["height"]),
                weight=str(payload["weight"]),
                training_goal=payload["training_goal"],
                sex=payload["sex"],
                message=message
            )

            await generate_weekly_plan_for_user(
                user_data=user_data,
                activity=act,
                week=week,
                websocket=websocket
            )

            await websocket.send_json({"detail": "ok"})
            await websocket.close()

        except WebSocketDisconnect:
            print("Клиент отключился — генерация остановлена")
        except Exception as e:
            print(f"WebSocket ошибка: {e}")
            try:
                await websocket.send_json({"detail": f"Ошибка: {str(e)}"})
            except:
                pass
            await websocket.close(code=1011)