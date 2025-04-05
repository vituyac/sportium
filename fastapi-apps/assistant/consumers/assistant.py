from fastapi import WebSocket, WebSocketDisconnect, Depends
from core.models import db_helper
from core.schemas import UserSchema
from sqlalchemy.ext.asyncio import AsyncSession
from utils.ws_manager import manager
from services.assistant_service import generate_weekly_plan_for_user
from fastapi import APIRouter
import json

def register_ws_routes(app):
    @app.websocket('/ws/plan/{week}/')
    async def websocket_endpoint(websocket: WebSocket, week: str, session: AsyncSession = Depends(db_helper.session_getter)):
        await manager.connect(websocket)
        try:
            while True:
                data = await websocket.receive_json()
                act = data.get("act")
                user_data = UserSchema(**data.get("user_data"))

                response = await generate_weekly_plan_for_user(
                    user_data=user_data,
                    session=session,
                    activity=act,
                    week=week
                )
                if response:
                    await manager.send_personal_message("OK", websocket)
                else:
                    await manager.send_personal_message("ERROR", websocket)

        except WebSocketDisconnect:
            manager.disconnect(websocket)