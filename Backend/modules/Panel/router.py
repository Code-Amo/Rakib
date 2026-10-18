from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from core.security import get_current_user 
from .schemas import DashboardData, TrophyResponse
from .service import get_dashboard_data, get_user_trophies

router = APIRouter()

@router.get("/dashboard", response_model=DashboardData, status_code=200)
def read_dashboard(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user) 
):
    return get_dashboard_data(db, current_user)
@router.get("/trophy", response_model=list[TrophyResponse])
def read_trophies(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return get_user_trophies(db, current_user.id)