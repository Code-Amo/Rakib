from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from core.database import Base

class User(Base):
    __tablename__ = "users"

    # --- Identité et compte ---
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    
    # --- Sécurité et Vérification (OTP) ---
    verification_code = Column(String, nullable=True)
    verification_expire_at = Column(DateTime, nullable=True)
    is_verified = Column(Boolean, default=False)
    avatar_url = Column(String, nullable=True)
    
    # --- Traçabilité (Timestamps) ---
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # --- CGU et Politique de Confidentialité (RGPD) ---
    cgu_accepted_at = Column(DateTime, nullable=True)
    cgu_version = Column(String, default="1.0", nullable=False)