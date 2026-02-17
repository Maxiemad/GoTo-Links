# Backend wrapper for Next.js app
# This file exists for supervisor compatibility
# All API routes are handled by Next.js API routes

from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()

@app.get("/api/health")
async def health_check():
    return JSONResponse({"status": "ok", "message": "Use Next.js API routes"})
