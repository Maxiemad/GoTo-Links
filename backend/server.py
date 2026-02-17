# Backend proxy for Next.js API routes
# Routes all /api/* requests to Next.js running on port 3000

from fastapi import FastAPI, Request
from fastapi.responses import Response
import httpx

app = FastAPI()

NEXTJS_URL = "http://localhost:3000"

@app.api_route("/api/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
async def proxy_to_nextjs(request: Request, path: str):
    """Proxy all API requests to Next.js"""
    url = f"{NEXTJS_URL}/api/{path}"
    
    # Get request body
    body = await request.body()
    
    # Forward headers (except host)
    headers = dict(request.headers)
    headers.pop("host", None)
    
    # Forward cookies
    cookies = dict(request.cookies)
    
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.request(
            method=request.method,
            url=url,
            content=body,
            headers=headers,
            cookies=cookies,
            params=dict(request.query_params),
        )
        
        # Create response with same status, headers, and body
        resp = Response(
            content=response.content,
            status_code=response.status_code,
            media_type=response.headers.get("content-type"),
        )
        
        # Forward Set-Cookie headers
        for key, value in response.headers.multi_items():
            if key.lower() == "set-cookie":
                resp.headers.append(key, value)
        
        return resp

@app.get("/health")
async def health_check():
    return {"status": "ok", "proxy": "active"}
