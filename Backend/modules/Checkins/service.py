from sqlalchemy.orm import Session
from datetime import datetime, timezone
from .models import Checkin
from modules.Panel.models import UserStats, Achievement, UserAchievement
from modules.Calendar.models import Objective 
from sqlalchemy import func

def check_trophies(db, user_id: int):
    unlocked_ids = [ua.achievement_id for ua in db.query(UserAchievement).filter(UserAchievement.user_id == user_id).all()]
    all_achievements = db.query(Achievement).all()
    total_checkins = db.query(Checkin).filter(Checkin.user_id == user_id).count()
    
    sport_checkins = db.query(Checkin).join(Objective).filter(
        Checkin.user_id == user_id,
        Objective.category == 'sport'
    ).count()
    
    newly_unlocked = [] 

    for ach in all_achievements:
        if ach.id in unlocked_ids:
            continue
            
        is_earned = False
        
        if ach.category == 'sport':
            if sport_checkins >= ach.target:
                is_earned = True
        elif ach.category == 'global':
            if len(unlocked_ids) >= 15:
                is_earned = True
        else:
            if total_checkins >= ach.target:
                is_earned = True
                
        if is_earned:
            new_unlock = UserAchievement(user_id=user_id, achievement_id=ach.id)
            db.add(new_unlock)
            
            newly_unlocked.append({
                "title": ach.title, 
                "rarity": ach.rarity, 
                "description": ach.description
            })
            print(f"🏆 Trophée débloqué : {ach.title} !")
            
    db.commit()
    return newly_unlocked 

def register_checkin(db: Session, user_id: int, objective_id: int):
    today = datetime.now(timezone.utc).date()

    existing = db.query(Checkin).filter(
        Checkin.user_id == user_id,
        Checkin.objective_id == objective_id,
        Checkin.date == today
    ).first()
    
    if existing:
        raise ValueError("Déjà validé aujourd'hui !")

    new_checkin = Checkin(
        user_id=user_id, 
        objective_id=objective_id, 
        date=today,
        xp_earned=10
    )
    db.add(new_checkin)

    stats = db.query(UserStats).filter(UserStats.user_id == user_id).first()
    if stats:
        stats.current_xp += new_checkin.xp_earned
        
        while stats.current_xp >= stats.next_level_xp:
            stats.level += 1
            stats.current_xp -= stats.next_level_xp
            
    db.commit()
    db.refresh(new_checkin)
    
    unlocked_trophies = check_trophies(db, user_id)
    
    return new_checkin, unlocked_trophies