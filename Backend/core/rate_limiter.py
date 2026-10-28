import os
from fastapi import Request, Response
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

def get_real_ip(request: Request) -> str:
    xff = request.headers.get("X-Forwarded-For")
    if xff:
        return xff.split(",")[0].strip()
    xri = request.headers.get("X-Real-IP")
    if xri:
        return xri.strip()
    return get_remote_address(request) or "unknown"

def get_rate_limit_key(request: Request) -> str:
    token = request.cookies.get("access_token")
    if token:
        try:
            import jwt
            from core.security import SECRET_KEY, ALGORITHM
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = payload.get("sub")
            if user_id:
                return f"user:{user_id}"
        except Exception:
            pass
    return f"ip:{get_real_ip(request)}"

limiter = Limiter(
    key_func=get_rate_limit_key,
    headers_enabled=True,
    storage_uri=os.getenv("REDIS_URL", "memory://"),
    default_limits=["100/minute"]
)

def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded) -> Response:
    return JSONResponse(
        status_code=429,
        content={
            "success": False,
            "error": "rate_limit_exceeded",
            "message": "Trop de requêtes. Veuillez patienter avant de réessayer.",
        }
    )