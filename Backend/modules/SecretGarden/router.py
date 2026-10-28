from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from modules.identity.router import get_current_user
from . import schemas, service

router = APIRouter()

@router.get("/journal")
def get_journal(db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return service.get_today_journal(db, current_user.id)

@router.post("/journal")
def save_journal(data: schemas.JournalSchema, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    return service.save_journal(db, current_user.id, data.content)