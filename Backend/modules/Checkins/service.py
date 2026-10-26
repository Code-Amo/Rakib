from sqlalchemy.orm import Session
from datetime import datetime, timezone
from .models import Checkin
from modules.Panel.models import UserStats, Achievement, UserAchievement
from modules.Calendar.models import Objective 

def check_trophies(db, user_id: int):
    unlocked_ids = [ua.achievement_id for ua in db.query(UserAchievement).filter(UserAchievement.user_id == user_id).all()]
    all_achievements = db.query(Achievement).all()
    
    sport_checkins = db.query(Checkin).join(Objective).filter(Checkin.user_id == user_id, Objective.category == 'Sport').count()
    intel_checkins = db.query(Checkin).join(Objective).filter(Checkin.user_id == user_id, Objective.category == 'Intelligence').count()
    creation_checkins = db.query(Checkin).join(Objective).filter(Checkin.user_id == user_id, Objective.category == 'Créativité').count()
    career_checkins = db.query(Checkin).join(Objective).filter(Checkin.user_id == user_id, Objective.category == 'Career').count()
    mental_checkins = db.query(Checkin).join(Objective).filter(Checkin.user_id == user_id, Objective.category == 'Mental').count()
    
    newly_unlocked = [] 

    for ach in all_achievements:
        if ach.id in unlocked_ids:
            continue
            
        is_earned = False
        
        if ach.category == 'Sport' and sport_checkins >= ach.target:
            is_earned = True
        elif ach.category == 'Intelligence' and intel_checkins >= ach.target:
            is_earned = True
        elif ach.category == 'Créativité' and creation_checkins >= ach.target:
            is_earned = True
        elif ach.category == 'Career' and career_checkins >= ach.target:
            is_earned = True
        elif ach.category == 'Mental' and mental_checkins >= ach.target:
            is_earned = True
        elif ach.category == 'global':
            if (len(unlocked_ids) + len(newly_unlocked)) >= (len(all_achievements) - 1):
                is_earned = True
                
        if is_earned:
            new_unlock = UserAchievement(user_id=user_id, achievement_id=ach.id)
            db.add(new_unlock)
            newly_unlocked.append({
                "title": ach.title, 
                "rarity": ach.rarity, 
                "description": ach.description
            })
            
    db.commit()
    return newly_unlocked 

def register_checkin(db: Session, user_id: int, objective_id: int):
    today = datetime.now(timezone.utc).date()

    objective = db.query(Objective).filter(Objective.id == objective_id, Objective.user_id == user_id).first()
    if not objective:
        raise ValueError("Objectif introuvable ou tu n'as pas la permission.")

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
from datetime import datetime, timezone, timedelta # <-- Ajoute timedelta

def register_checkin(db: Session, user_id: int, objective_id: int):
    today = datetime.now(timezone.utc).date()

    objective = db.query(Objective).filter(Objective.id == objective_id, Objective.user_id == user_id).first()
    if not objective:
        raise ValueError("Objectif introuvable.")

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
        if stats.last_checkin_date == today - timedelta(days=1):
            stats.current_streak += 1
        elif stats.last_checkin_date == today:
            pass
        else:
            stats.current_streak = 1
            
        stats.last_checkin_date = today
        
        xp_to_add = new_checkin.xp_earned
        if stats.current_streak >= 7:
            xp_to_add = int(xp_to_add * 1.2)
            
        stats.current_xp += xp_to_add
        
        while stats.current_xp >= stats.next_level_xp:
            stats.level += 1
            stats.current_xp -= stats.next_level_xp
            
    db.commit()
    db.refresh(new_checkin)
    
    unlocked_trophies = check_trophies(db, user_id)
    
    return new_checkin, unlocked_trophies