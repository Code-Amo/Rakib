from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from core.config import DATABASE_URL

# URL for postgresql 
engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Get db in fastapi
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()