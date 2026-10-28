from sqlalchemy.orm import Session
from datetime import date
from .models import JournalEntry

def get_today_journal(db: Session, user_id: int):
    today = date.today()
    entry = db.query(JournalEntry).filter(
        JournalEntry.user_id == user_id,
        JournalEntry.date == today
    ).first()
    
    if not entry:
        return {"content": ""}
    return {"content": entry.content}

def save_journal(db: Session, user_id: int, content: str):
    today = date.today()
    entry = db.query(JournalEntry).filter(
        JournalEntry.user_id == user_id,
        JournalEntry.date == today
    ).first()

    if entry:
        entry.content = content
    else:
        entry = JournalEntry(user_id=user_id, date=today, content=content)
        db.add(entry)
    
    db.commit()
    return {"status": "success", "message": "Carnet sauvegardé."}