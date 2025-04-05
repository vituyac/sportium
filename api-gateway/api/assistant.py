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
router = APIRouter()

@router.post("/plan/")
async def get_plan(request: Request, authorization: str = Header(None)):
    
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization token")
    
    payload = get_current_token_payload(authorization)
    body = await request.json()

    json_response = {
        "user_id": payload["sub"],
        "week": body.get("week")
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{SERVICES['assistant']}/api/assistant/plan/",
            json=json_response
        )

    return response.json()

@router.post("/plan/today/")
async def get_plan(request: Request, authorization: str = Header(None)):
    
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization token")
    
    payload = get_current_token_payload(authorization)
    body = await request.json()

    json_response = {
        "user_id": payload["sub"],
        "week": "this"
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{SERVICES['assistant']}/api/assistant/plan/today/",
            json=json_response
        )

    return response.json()

@router.post("/plan/mark-done/")
async def get_plan(request: Request, authorization: str = Header(None)):
    
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization token")
    
    payload = get_current_token_payload(authorization)
    body = await request.json()

    json_response = {
        "user_id": payload["sub"],
        "item_id": body.get("item_id"),
        "item_type": body.get("item_type"),
        "week": "this"
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{SERVICES['assistant']}/api/assistant/plan/mark-done/",
            json=json_response
        )

    return response.json()