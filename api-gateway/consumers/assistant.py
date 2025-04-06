from fastapi import Request, HTTPException, Header, APIRouter, Response, File, UploadFile
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.security import HTTPBearer
import httpx, re

from core.config import SERVICES
from utils.jwt_decode import *
from services.proxy import proxy_post_request, proxy_get_request

http_bearer = HTTPBearer(auto_error=False)
router = APIRouter()

import asyncio, json
import websockets
from fastapi import WebSocket, WebSocketDisconnect, APIRouter
from utils.jwt_decode import *
from fastapi.security import HTTPAuthorizationCredentials

def register_ws_routes(app):
    @app.websocket('/ws/plan/')
    async def proxy_ws_with_auth(websocket: WebSocket):
        await websocket.accept()

        try:
            initial_data = await websocket.receive_json()
            access_token = initial_data.get("access")
            act = initial_data.get("act")
            week = initial_data.get("week", "this")
            message = initial_data.get("message", None)

            if not access_token or not act:
                await websocket.send_text(json.dumps({"error": "Missing access token or act"}))
                await websocket.close()
                return

            try:
                payload = get_current_token_payload(access_token)

                required_fields = ["age", "height", "weight", "training_goal", "sex"]
                missing_fields = [field for field in required_fields if payload.get(field) is None]

                if missing_fields:
                    await websocket.send_json({
                        "error": "Вы не до конца заполнили профиль",
                        "missing_fields": missing_fields
                    })
                    await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
                    return

            except Exception as e:
                await websocket.send_json({
                    "error": "Ошибка при обработке токена",
                    "details": str(e)
                })
                await websocket.close()
                return

            user_data = {
                "id": payload["sub"],
                "age": payload["age"],
                "height": str(payload["height"]),
                "weight": str(payload["weight"]),
                "training_goal": payload["training_goal"],
                "sex": payload["sex"],
                "message": message
            }

            assistant_ws_url = f"ws://assistant-service:8004/ws/plan/{week}/"

            async with websockets.connect(assistant_ws_url) as assistant_ws:
                await assistant_ws.send(json.dumps({
                    "act": act,
                    "user_data": user_data
                }))

                async def client_to_assistant():
                    while True:
                        data = await websocket.receive_text()
                        await assistant_ws.send(data)

                async def assistant_to_client():
                    while True:
                        data = await assistant_ws.recv()
                        await websocket.send_text(data)

                await asyncio.gather(client_to_assistant(), assistant_to_client())

        except WebSocketDisconnect:
            print("❌ WebSocket клиент отключился")
        except Exception as e:
            print(f"❗ WebSocket proxy error: {e}")
            await websocket.close(code=1011)