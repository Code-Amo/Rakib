from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from core.security import get_current_user
from modules.Panel.models import UserStats
from .schemas import GlobalStatsResponse
from .service import calculate_global_stats

router = APIRouter()

@router.get("/", response_model=GlobalStatsResponse)
def get_progression(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    stats = db.query(UserStats).filter(UserStats.user_id == current_user.id).first()
    result = calculate_global_stats(stats)
    
    return {
        **result,
        "breakdown": {
            "sport": stats.xp_sport if stats else 0,
            "intel": stats.xp_intel if stats else 0,
            "crea": stats.xp_crea if stats else 0,
            "career": stats.xp_career if stats else 0,
            "mental": stats.xp_mental if stats else 0,
        }
    }