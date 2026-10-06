from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from . import schemas, services, models
from core.database import get_db  
import random

router = APIRouter()

@router.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):

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
def login_user(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = services.authenticate_user(db=db, email=credentials.email, password=credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou mot de passe incorrect."
        )
    return {"message": "Connexion réussie", "user_id": user.id, "username": user.username}
@router.post("/verify")
def verify_code(payload: schemas.VerifyCode, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable.")
    print(payload.email)
    print(f"{repr(user.verification_code)}")
    print(f"{repr(payload.code)}")
    if str(user.verification_code).strip() == str(payload.code).strip():
        user.is_verified = True
        user.verification_code = None  
        db.commit()
        return {"message": "Compte vérifié avec succès !"}

    raise HTTPException(status_code=400, detail="Code de vérification incorrect.")