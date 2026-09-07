from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core.database import get_db
from modules.identity import schemas, services, models

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Cet email est déjà utilisé.")
    
    if db.query(models.User).filter(models.User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Ce pseudo est déjà pris.")
    
    return services.create_user(db=db, user=user)
@router.post("/login")
def login(user_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = services.authenticate_user(db, email=user_data.email, password=user_data.password)
    if not user :
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            details="Email ou mot de passe incorrect"
        )
    return("message": "Connexion")