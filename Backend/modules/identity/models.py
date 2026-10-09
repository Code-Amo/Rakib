from sqlalchemy import Column, Integer, String, Boolean, DateTime
from core.database import Base

class User(Base):
    __tablename__ = "users"
# identité et compte
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    verification_code = Column(String, nullable=True)
    verification_expire_at = Column(DateTime, nullable=True)
    is_verified = Column(Boolean, default=False)
# cgu et politique de confidentialité
    cgu_accepted_at = Column(DateTime, nullable=True)
    cgu_version = Column(String, default="1.0")
    xp = Column(Integer, default=0)
    level = Column(Integer, default=1)