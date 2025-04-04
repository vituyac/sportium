from fastapi import Request, HTTPException, Response
import httpx

async def proxy_post_request(request: Request, url: str, auth: bool = False) -> Response:
    try:
        body = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid or missing JSON body")

    if not body:
        raise HTTPException(status_code=400, detail="Empty body")

    query = dict(request.query_params)

    headers = {}
    if auth:
        auth_header = request.headers.get("authorization")
        if auth_header:
            headers["Authorization"] = auth_header

    async with httpx.AsyncClient() as client:
        response = await client.post(
            url,
            json=body,
            params=query,
            headers=headers
        )

    return Response(
        content=response.text,
        status_code=response.status_code,
        media_type="application/json"
    )

async def proxy_get_request(request: Request, url: str, auth: bool = False) -> Response:
    query = dict(request.query_params)

    headers = {}
    if auth:
        auth_header = request.headers.get("authorization")
        if auth_header:
            headers["Authorization"] = auth_header

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=query, headers=headers)

    return Response(
        content=response.text,
        status_code=response.status_code,
        media_type="application/json"
    )