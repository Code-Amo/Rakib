import uvicorn
import os
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from core.database import engine, Base
from core.rate_limiter import limiter, rate_limit_exceeded_handler

from modules.Panel.router import router as dashboard_router 
from modules.identity.router import router as identity_router
from modules.Calendar.router import router as calendar_router
from modules.Panel.router import router as panel_router
from modules.Checkins.router import router as checkins_router
from modules.Progression.router import router as progression_router
from modules.companion.router import router as compagnon_router
from modules.SecretGarden.router import router as secret_garden_router

Base.metadata.create_all(bind=engine)

is_production = os.getenv("ENVIRONMENT") == "production"

app = FastAPI(
    title="Rakib API",
    version="1.0.0",
    docs_url=None if is_production else "/docs",
    redoc_url=None if is_production else "/redoc",
    openapi_url=None if is_production else "/openapi.json"
)

# --- MIDDLEWARES ---
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware) 

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROUTERS ---
app.include_router(identity_router, prefix="/auth", tags=["Auth"])
app.include_router(checkins_router, prefix="/checkins", tags=["Checkins"])
app.include_router(panel_router)
app.include_router(calendar_router, prefix="/calendar", tags=["Calendar"])
app.include_router(dashboard_router, prefix="/panel", tags=["Dashboard"])
app.include_router(compagnon_router, prefix="/compagnon", tags=["Compagnon"])
app.include_router(progression_router, prefix="/progression", tags=["Progression"])
app.include_router(secret_garden_router, prefix="/secret_garden", tags=["Secret Garden"])

@app.get("/")
def root():
    return {"status": "ok", "message": "Good"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)