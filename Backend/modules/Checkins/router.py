from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from core.security import get_current_user
from .schemas import CheckinCreate
from . import service

router = APIRouter()

@router.post("", status_code=201)
def create_checkin(
    data: CheckinCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    try:
        checkin, unlocked_trophies = service.register_checkin(db, current_user.id, data.objective_id)
        
        return {
            "status": "success",
            "xp_gained": checkin.xp_earned,
            "unlocked_trophies": unlocked_trophies
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur interne : {str(e)}")