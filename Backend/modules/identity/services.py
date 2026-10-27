from passlib.context import CryptContext
from sqlalchemy.orm import Session
from modules.identity import models, schemas
import smtplib
from datetime import datetime, timezone
from . import models, schemas
from email.message import EmailMessage
from modules.Panel.models import UserStats

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_user(db: Session, user: schemas.UserCreate, code:str = None):
    hashed_pwd = hash_password(user.password)
    db_user = models.User(
        email=user.email,
        username=user.username,
        name=user.name,
        hashed_password=hashed_pwd,
        verification_code=code,
        is_verified=False,
        cgu_accepted_at=datetime.now(timezone.utc),
        cgu_version="1.0",
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    new_stats = UserStats(
        user_id = db_user.id,
        level =1,
        current_xp =0,
        next_level_xp =100,
        current_streak =0
    )
    db.add(new_stats)
    db.commit()
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user
def send_verification_email(to_email: str, code: str):
    msg = EmailMessage()
    msg["Subject"]= "Votre code de vérification"
    msg["From"]= "monmail"
    msg["To"]= to_email
    msg.set_content(f"Bienvenu sur Rakib ! Votre code de vérification est : {code}")