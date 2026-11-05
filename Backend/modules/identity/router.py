from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from . import schemas, services, models
from core.database import get_db
import secrets
import os
from datetime import datetime, timezone, timedelta
from modules.identity.models import User
from .schemas import AvatarUpdate
import jwt
from core.rate_limiter import limiter
from core.security import (
    create_access_token,
    create_refresh_token,
    get_current_user,
    refresh_token as refresh_token_service,
    get_cookie_config,
    SECRET_KEY,
    ALGORITHM,
)

router = APIRouter()

is_production = os.getenv("ENVIRONMENT") == "production"


@router.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("3/hour")
def register_user(request: Request, response: Response, user: schemas.UserCreate, db: Session = Depends(get_db)):
    if not user.accepted_cgu:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vous devez accepter les CGU et notre politique de confidentialité."
        )
    existing_email = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Un compte existe déjà avec cet e-mail."
        )

    existing_username = db.query(models.User).filter(models.User.username == user.username).first()
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ce pseudo est déjà pris."
        )


    code = str(secrets.randbelow(900000) + 100000)
    db_user = services.create_user(db=db, user=user, code=code)
    services.send_verification_email(user.email, code)

    return db_user


@router.post("/resend-verification")
@limiter.limit("3/hour")
def resend_verification(request: Request, response: Response, payload: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable.")

    if user.is_verified:
        raise HTTPException(status_code=400, detail="Ce compte est déjà vérifié.")

    code = str(secrets.randbelow(900000) + 100000)
    user.verification_code = code
    user.verification_expire_at = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(minutes=15)
    db.commit()

    services.send_verification_email(user.email, code)
    return {"message": "Un nouveau code a été envoyé avec succès."}


@router.post("/login")
@limiter.limit("5/minute")
def login_user(request: Request, credentials: schemas.UserLogin, response: Response, db: Session = Depends(get_db)):
    user = services.authenticate_user(db=db, email=credentials.email, password=credentials.password)
    if not user:
        raise HTTPException(status_code=401, detail="E-mail ou mot de passe incorrect.")

    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token_value = create_refresh_token(data={"sub": str(user.id)})

    cookie_cfg = get_cookie_config()

    response.set_cookie(
        key="refresh_token",
        value=refresh_token_value,
        max_age=30 * 24 * 3600,
        **cookie_cfg,
    )
    response.set_cookie(
        key="access_token",
        value=access_token,
        max_age=15 * 60,
        **cookie_cfg,
    )

    return {
        "message": "Connexion réussie",
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "username": user.username,
    }


@router.post("/verify-reset")
@limiter.limit("10/minute")
def verify_reset_code(request: Request, response: Response, payload: schemas.VerifyCode, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable.")

    now = datetime.now(timezone.utc).replace(tzinfo=None)
    if user.verification_expire_at and now > user.verification_expire_at:
        raise HTTPException(status_code=400, detail="Le code de vérification a expiré")

    if str(user.verification_code).strip() == str(payload.code).strip():
        user.is_verified = True
        user.verification_expire_at = None
        user.verification_code = None
        db.commit()
        reset_token = create_access_token(data={"sub": str(user.id), "scope": "reset_password"})
        return {"message": "Compte vérifié avec succès !", "reset_token": reset_token}
    raise HTTPException(status_code=400, detail="Code de vérification incorrect.")


@router.post("/verify-register")
@limiter.limit("10/minute")
def verify_register(request: Request, payload: schemas.VerifyCode, response: Response, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable.")

    now = datetime.now(timezone.utc).replace(tzinfo=None)
    if user.verification_expire_at and now > user.verification_expire_at:
        raise HTTPException(status_code=400, detail="Le code de vérification a expiré")

    if str(user.verification_code).strip() == str(payload.code).strip():
        user.is_verified = True
        user.verification_expire_at = None
        user.verification_code = None
        access_token = create_access_token(data={"sub": str(user.id)})
        refresh_token_value = create_refresh_token(data={"sub": str(user.id)})
        db.commit()

        cookie_cfg = get_cookie_config()

        response.set_cookie(
            key="refresh_token",
            value=refresh_token_value,
            max_age=30 * 24 * 3600,
            **cookie_cfg,
        )
        response.set_cookie(
            key="access_token",
            value=access_token,
            max_age=15 * 60,
            **cookie_cfg,
        )

        return {
            "message": "Connexion réussie",
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": user.id,
            "username": user.username,
        }
    raise HTTPException(status_code=400, detail="Code de vérification incorrect.")


@router.post("/forget")
@limiter.limit("3/hour")
def forget(request: Request, response: Response, payload: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Aucun compte n'est inscris avec cet e-mail.")
    code = str(secrets.randbelow(900000) + 100000)
    user.verification_code = code
    user.verification_expire_at = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(minutes=15)
    db.commit()
    services.send_verification_email(user.email, code)
    return {"message": "Compte trouvé !"}


@router.post("/password-reset")
@limiter.limit("5/hour")
def reset_password(request: Request, response: Response, payload: schemas.ResetPassword, db: Session = Depends(get_db)):
    try:
        token_data = jwt.decode(payload.reset_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id_from_token = token_data.get("sub")
        scope = token_data.get("scope")

        if scope != "reset_password":
            raise HTTPException(status_code=403, detail="Token invalide pour cette action.")

        user = db.query(models.User).filter(models.User.id == int(user_id_from_token)).first()
        if not user or user.email != payload.email:
            raise HTTPException(status_code=403, detail="Action non autorisée.")

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Le lien de réinitialisation a expiré.")
    except Exception:
        raise HTTPException(status_code=401, detail="Token invalide.")

    user.hashed_password = services.hash_password(payload.new_password)
    db.commit()
    return {"message": "Mot de passe réinitialisé avec succès !"}


@router.put("/me/avatar", status_code=status.HTTP_200_OK)
def update_user_avatar(
    data: AvatarUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    current_user.avatar_url = data.avatar_url
    db.commit()
    db.refresh(current_user)

    return {
        "message": "Photo de profil mise à jour avec succès",
        "avatar_url": current_user.avatar_url
    }


@router.post("/refresh")
def refresh_token(request: Request, response: Response):
    return refresh_token_service(request, response)


@router.put("/me")
def update_profile(
    data: schemas.UserUpdateName,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not data.name.strip():
        raise HTTPException(status_code=400, detail="Le nom ne peut pas être vide.")

    updated_user = services.update_user_name(db, current_user, data.name.strip())
    return {"message": "Profil mis à jour avec succès.", "name": updated_user.name}


@router.put("/me/password")
def update_password(
    data: schemas.UserUpdatePassword,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if len(data.new_password) < 8:
        raise HTTPException(status_code=400, detail="Le nouveau mot de passe doit faire au moins 8 caractères.")

    try:
        services.update_user_password(db, current_user, data.old_password, data.new_password)
        return {"message": "Mot de passe mis à jour avec succès."}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/me", status_code=status.HTTP_200_OK)
def delete_account(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    services.delete_user_account(db, current_user)
    return {"message": "Compte supprimé avec succès."}


@router.post("/logout")
def logout(response: Response):
    cookie_cfg = get_cookie_config()
    response.delete_cookie(key="access_token", **cookie_cfg)
    response.delete_cookie(key="refresh_token", **cookie_cfg)
    return {"message": "Déconnexion réussie."}

@router.get("/redirect")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "name": current_user.name,
        "avatar_url": current_user.avatar_url,
    }