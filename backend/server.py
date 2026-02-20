import os
from fastapi import FastAPI, Request
from fastapi.responses import Response
import httpx

app = FastAPI()
NEXTJS_URL = os.getenv('NEXTJS_URL', 'http://localhost:3000')

@app.api_route("/api/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_api(path: str, request: Request):
    async with httpx.AsyncClient() as client:
        url = f"{NEXTJS_URL}/api/{path}"
        response = await client.request(
            method=request.method,
            url=url,
            headers={k: v for k, v in request.headers.items() if k.lower() != 'host'},
            content=await request.body(),
            cookies=request.cookies,
        )
        return Response(content=response.content, status_code=response.status_code,
                       headers=dict(response.headers), media_type=response.headers.get('content-type'))

@app.get("/health")
def health_check():
    return {"status": "ok", "proxy": "active"}
