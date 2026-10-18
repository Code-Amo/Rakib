from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from core.security import get_current_user 
from .schemas import DashboardData
from .service import get_dashboard_data

router = APIRouter()

@router.get("/dashboard", response_model=DashboardData, status_code=200)
def read_dashboard(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user) 
):
    return get_dashboard_data(db, current_user)