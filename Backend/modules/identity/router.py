from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from . import schemas, services, models
from core.database import get_db  
import random
from core.security import create_access_token, create_refresh_token
from datetime import datetime, timezone, timedelta

router = APIRouter()

@router.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
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

    code = str(random.randint(100000, 999999))
    print(f"le code est : {code}")
    return services.create_user(db=db , user=user, code=code)

@router.post("/login")
def login_user(credentials: schemas.UserLogin, response: Response, db: Session = Depends(get_db)):
    user = services.authenticate_user(db=db, email=credentials.email, password=credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou mot de passe incorrect."
        )
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,        # Empêche la lecture via JS (XSS)
        samesite="lax",       # Protège contre les attaques CSRF
        secure=False,         # Mettre à True en production avec HTTPS
        max_age=30 * 24 * 3600 
    )

    return {
        "message": "Connexion réussie",
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user.id,
        "username": user.username
    }
@router.post("/verify-reset")
def verify_code(payload: schemas.VerifyCode, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable.")
    if user.verification_expire_at and datetime.now(timezone.utc) > user.verification_expire_at:
        raise HTTPException(status_code=400, detail="Le code de vérification a expiré")
    print(payload.email)
    print(f"{repr(user.verification_code)}")
    print(f"{repr(payload.code)}")
    if str(user.verification_code).strip() == str(payload.code).strip():
        user.is_verified = True
        user.verification_expire_at = datetime.now(timezone.utc) + timedelta(minutes=3)
        user.verification_code = None  
        db.commit()
        reset_token = create_access_token(data={"sub": str(user.id), "scope": "reset_password"})
        return {"message": "Compte vérifié avec succès !",
                "reset_token": reset_token
        }
    raise HTTPException(status_code=400, detail="Code de vérification incorrect.")
@router.post("/verify-register")
def verify_register(payload: schemas.VerifyCode, response:Response, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable.")
    if user.verification_expire_at and datetime.now(timezone.utc) > user.verification_expire_at:
        raise HTTPException(status_code=400, detail="Le code de vérification a expiré")
    print(payload.email)
    print(f"{repr(user.verification_code)}")
    print(f"{repr(payload.code)}")
    if str(user.verification_code).strip() == str(payload.code).strip():
        user.is_verified = True
        user.verification_expire_at = datetime.now(timezone.utc) + timedelta(minutes=3)
        user.verification_code = None  
        access_token = create_access_token(data={"sub": str(user.id)})
        refresh_token = create_refresh_token(data={"sub": str(user.id)})
        db.commit()
        response.set_cookie(
            key="refresh_token",
            value=refresh_token,
            httponly=True,        # Empêche la lecture via JS (XSS)
            samesite="lax",       # Protège contre les attaques CSRF
            secure=False,         # Mettre à True en production avec HTTPS
            max_age=30 * 24 * 3600 
        )

        return {
            "message": "Connexion réussie",
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": user.id,
            "username": user.username
        }
    raise HTTPException(status_code=400, detail="Code de vérification incorrect.")
@router.post("/forget")
def forget(payload: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Aucun compte n'est inscris avec cet e-mail.")
    code = random.randint(100000,900000)
    user.verification_code = code
    user.verification_expire_at = datetime.now(timezone.utc) + timedelta(minutes=3)
    db.commit()
    print(payload.email)
    print(f"{repr(user.verification_code)}")
    return {"message": "Compte trouvé !"}
@router.post("/password-reset")
def reset_password(payload: schemas.ResetPassword, db: Session=Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Aucun compte trouvé")
    user.hashed_password = services.hash_password(payload.new_password)
    db.commit()
    return {"message": "Mot de passe réinitialié avec succès :"}