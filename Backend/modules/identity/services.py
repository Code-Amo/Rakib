from sqlalchemy.orm import Session
from datetime import datetime, timezone
import os
import bcrypt
from sib_api_v3_sdk import Configuration, ApiClient, TransactionalEmailsApi, SendSmtpEmail

from modules.identity import models, schemas
from modules.identity.models import User
from modules.Panel.models import UserStats


def hash_password(password: str) -> str:
    pwd_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    pwd_bytes = plain_password.encode('utf-8')[:72]
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(pwd_bytes, hashed_bytes)

def create_user(db: Session, user: schemas.UserCreate, code: str = None):
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
        user_id=db_user.id,
        level=1,
        current_xp=0,
        next_level_xp=100,
        current_streak=0
    )
    db.add(new_stats)
    db.commit()
    
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user

# --- ENVOI D'EMAIL---
def send_verification_email(to_email: str, code: str):
    try:
        configuration = Configuration()
        configuration.api_key['api-key'] = os.getenv("BREVO_API_KEY")

        api_instance = TransactionalEmailsApi(ApiClient(configuration))
        
        email = SendSmtpEmail(
            to=[{"email": to_email}],
            sender={"name": "Rakib", "email": "contact.rakib.app@gmail.com"},
            subject="Votre code de vérification - Rakib",
            html_content=f"""
                <div style="font-family: sans-serif; background-color: #141414; color: #ffffff; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #9501d9;">Bienvenue sur Rakib !</h2>
                    <p>Pour valider votre compte, voici votre code de vérification :</p>
                    <h1 style="background-color: #262626; padding: 10px; display: inline-block; border-radius: 5px;">{code}</h1>
                    <p style="color: #a0aec0; font-size: 12px;">Ce code expirera dans 15 minutes.</p>
                </div>
            """
        )
        
        api_instance.send_transac_email(email)
        print(f"Email envoyé avec succès à {to_email} via Brevo")
    except Exception as e:
        print(f"Erreur Brevo : {e}")

def update_user_name(db: Session, user: User, new_name: str):
    user.name = new_name
    db.commit()
    db.refresh(user)
    return user

def update_user_password(db: Session, user: User, old_password: str, new_password: str):
    if not verify_password(old_password, user.hashed_password):
        raise ValueError("L'ancien mot de passe est incorrect.")
    
    user.hashed_password = hash_password(new_password)
    db.commit()
    return True

def delete_user_account(db: Session, user: User):
    db.delete(user)
    db.commit()
    return True