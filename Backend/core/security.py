import os
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status, Request, Response
import jwt

from core.database import get_db
from modules.identity.models import User 

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "15"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "90"))

if not SECRET_KEY:
    raise ValueError("La variable SECRET_KEY n'est pas définie dans le fichier .env")


def get_cookie_config() -> dict:
    """
    Config cookie adaptée à l'environnement.

    - Prod (HTTPS) : SameSite=None + Secure=True → cookies cross-site
    - Dev  (HTTP)  : SameSite=Lax  + Secure=False → cookies acceptés sur localhost

    Note : localhost:5173 et localhost:8000 sont considérés comme le MÊME site
    par la spec SameSite (le port n'est pas pris en compte). Donc Lax suffit
    pour la communication front↔back en développement.
    """
    is_prod = os.getenv("ENVIRONMENT") == "production"
    return {
        "httponly": True,
        "samesite": "none" if is_prod else "lax",
        "secure": is_prod,
        "path": "/",
    }


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Le token a expiré")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Token invalide")


def get_current_user(
    request: Request,
    db: Session = Depends(get_db)
):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Non authentifié")

    payload = decode_access_token(token)

    if payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Type de token invalide")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Token invalide (ID manquant)")

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")

    return user


def refresh_token(request: Request, response: Response):
    refresh_token_value = request.cookies.get("refresh_token")
    if not refresh_token_value:
        raise HTTPException(status_code=401, detail="Refresh token manquant")

    try:
        payload = jwt.decode(refresh_token_value, SECRET_KEY, algorithms=[ALGORITHM])

        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Type de token invalide")

        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Refresh token invalide")

        new_access_token = create_access_token(data={"sub": str(user_id)})

        cookie_cfg = get_cookie_config()
        response.set_cookie(
            key="access_token",
            value=new_access_token,
            max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            **cookie_cfg,
        )
        return {"message": "Token rafraîchi avec succès"}

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expirée, veuillez vous reconnecter")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Refresh token invalide")