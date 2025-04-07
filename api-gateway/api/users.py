from fastapi import Request, HTTPException, Header, APIRouter, Response, File, UploadFile
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.security import HTTPBearer
import httpx, re

from core.config import SERVICES
from utils.jwt_decode import *
from services.proxy import proxy_post_request, proxy_get_request

http_bearer = HTTPBearer(auto_error=False)
router = APIRouter()

@router.post("/login/")
async def user_login(request: Request):
    return await proxy_post_request(
        request, f"{SERVICES['users']}/api/users/login/"
    )

@router.post("/register/")
async def user_register(request: Request):
    return await proxy_post_request(
        request, f"{SERVICES['users']}/api/users/register/"
    )

@router.post("/register/confirm/")
async def user_register_confirm(request: Request):
    return await proxy_post_request(
        request, f"{SERVICES['users']}/api/users/register/confirm/"
    )

@router.post("/password/")
async def change_password(request: Request):
    return await proxy_post_request(
        request,
        f"{SERVICES['users']}/api/users/password/",
        auth=True
    )

@router.post("/login/vk/")
async def user_login(request: Request, authorization: str = Header(None)):
    return await proxy_post_request(
        request,
        f"{SERVICES['users']}/api/users/login/vk/",
        auth=True
    )

@router.post("/refresh/")
async def token_refresh(request: Request, authorization: str = Header(None)):
    
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization token")

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{SERVICES['users']}/api/users/refresh/",
            headers={"Authorization": authorization}
        )

    return response.json()

@router.get("/me/")
async def user_data(request: Request, authorization: str = Header(...)):
    return await proxy_get_request(
        request,
        f"{SERVICES['users']}/api/users/me/",
        auth=True
    )

@router.post("/me/avatar/")
async def upload_avatar(file: UploadFile = File(...), authorization: str = Header(...)):

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{SERVICES['users']}/api/users/me/avatar/",
            headers={"Authorization": authorization},
            files={"file": (file.filename, await file.read(), file.content_type)}
        )

    return Response(
        content=response.text,
        status_code=response.status_code,
        media_type="application/json"
    )

@router.delete("/me/avatar/")
async def delete_avatar(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization token")

    async with httpx.AsyncClient() as client:
        response = await client.delete(
            f"{SERVICES['users']}/api/users/me/avatar/",
            headers={"Authorization": authorization}
        )

    return Response(
        content=response.text,
        status_code=response.status_code,
        media_type="application/json"
    )

@router.put("/me/")
async def update_user_info(request: Request, authorization: str = Header(...)):
    body = await request.json()
    if not body: raise HTTPException(status_code=400, detail="Empty body")

    async with httpx.AsyncClient() as client:
        response = await client.put(
            f"{SERVICES['users']}/api/users/me/",
            json=body,
            headers={"Authorization": authorization}
        )

    return Response(
        content=response.text,
        status_code=response.status_code,
        media_type="application/json"
    )

@router.post("/forgot-password/")
async def forgot_password(request: Request):
    return await proxy_post_request(
        request,
        f"{SERVICES['users']}/api/users/forgot-password/"
    )

@router.post("/reset-password/")
async def reset_password(request: Request):
    return await proxy_post_request(
        request,
        f"{SERVICES['users']}/api/users/reset-password/"
    )

@router.get("/docs/")
async def proxy_docs(request: Request):

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{SERVICES['users']}/api/docs/",
        )

    modified_html = re.sub(
        r'url\s*:\s*[\'"]/openapi\.json[\'"]',
        'url: "/api/users/openapi.json"',
        response.text
    )

    return HTMLResponse(content=modified_html, status_code=response.status_code)

@router.get("/openapi.json", response_class=JSONResponse)
async def proxy_openapi():
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{SERVICES['users']}/openapi.json")
    
    return JSONResponse(content=response.json(), status_code=response.status_code)
