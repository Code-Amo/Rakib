from sqlalchemy.orm import Session
from .schemas import DashboardData
from modules.Panel.models import UserStats, Achievement, UserAchievement
from modules.Calendar.models import Objective
from modules.Checkins.models import Checkin
from modules.Progression.service import calculate_global_stats

def get_dashboard_data(db: Session, current_user):
    stats = db.query(UserStats).filter(UserStats.user_id == current_user.id).first()
    
    global_stats = calculate_global_stats(stats)

    total_trophies = db.query(Achievement).count()
    unlocked_trophies = db.query(UserAchievement).filter(UserAchievement.user_id == current_user.id).count()
    percentage = int((unlocked_trophies / total_trophies * 100)) if total_trophies > 0 else 0

    unlocked_ids = [ua.achievement_id for ua in db.query(UserAchievement).filter(UserAchievement.user_id == current_user.id).all()]
    next_ach = db.query(Achievement).filter(~Achievement.id.in_(unlocked_ids)).first()
    
    if next_ach:
        current_count = 0
        if next_ach.category != 'global':
            current_count = db.query(Checkin).join(Objective).filter(
                Checkin.user_id == current_user.id,
                Objective.category == next_ach.category
            ).count()
        
        current_count = min(current_count, next_ach.target)
        
        next_achievement_data = {
            "title": next_ach.title,
            "remaining_count": max(0, next_ach.target - current_count),
            "current_count": current_count,
            "target_count": next_ach.target
        }
    else:
        next_achievement_data = {
            "title": "Tous débloqués !",
            "remaining_count": 0,
            "current_count": 1,
            "target_count": 1
        }

    tasks_db = db.query(Objective).filter(Objective.user_id == current_user.id).limit(3).all()
    today_focus = [{"id": str(t.id), "title": t.title, "completed": False} for t in tasks_db]
    if not today_focus:
        today_focus = [{"id": "0", "title": "Crée ton premier objectif", "completed": False}]

    return DashboardData(
        user={
            "username": current_user.username,
            "name": current_user.name if current_user.name else current_user.username,
            "avatar_url": current_user.avatar_url,
            "is_online": True
        },
        level={
            "current_level": global_stats["level"],
            "title": "Bâtisseur", 
            "current_xp": global_stats["current_xp_in_level"],
            "max_xp": global_stats["xp_for_next_level"]
        },
        streak={
            "current": global_stats["current_streak"],
            "next_milestone": 7,
            "bonus_percentage": 10 if global_stats["current_streak"] >= 7 else 0
        },
        trophies_summary={
            "unlocked_count": unlocked_trophies,
            "total_count": total_trophies,
            "percentage": percentage
        },
        next_achievement=next_achievement_data,
        today_focus=today_focus
    )

def get_user_trophies(db: Session, user_id: int):
    all_trophies = db.query(Achievement).all()
    unlocked_trophies = db.query(UserAchievement).filter(UserAchievement.user_id == user_id).all()
    unlocked_ids = [ut.achievement_id for ut in unlocked_trophies]
    
    return [
        {
            "id": trophy.id,
            "title": trophy.title,
            "description": trophy.description,
            "rarity": trophy.rarity,
            "category": trophy.category,
            "is_unlocked": trophy.id in unlocked_ids 
        } for trophy in all_trophies
    ]