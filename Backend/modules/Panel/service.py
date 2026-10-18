from sqlalchemy.orm import Session
from .schemas import DashboardData

def get_dashboard_data(db: Session, current_user):
    # TODO: Remplacer par les vraies requêtes SQLAlchemy
    return DashboardData(
        user={
            "username": current_user.username if hasattr(current_user, 'username') else "Keisei",
            "name": current_user.name if hasattr(current_user, 'name') else "Momo",
            "avatar_url": None,
            "is_online": True
        },
        level={
            "current_level": 12,
            "title": "Bâtisseur",
            "current_xp": 450,
            "max_xp": 1000
        },
        trophies_summary={
            "unlocked_count": 6,
            "total_count": 16,
            "percentage": 38 
        },
        next_achievement={
            "title": "Machine",
            "remaining_count": 8,
            "current_count": 42,
            "target_count": 50
        },
        today_focus=[
            {"id": "1", "title": "Grappling", "completed": False},
            {"id": "2", "title": "Coder Rakib", "completed": True}
        ]
    )