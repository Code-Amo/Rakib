from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta
from .models import Checkin
from modules.Panel.models import UserStats, Achievement, UserAchievement
from modules.Calendar.models import Objective 

def check_trophies(db, user_id: int):
    unlocked_ids = [ua.achievement_id for ua in db.query(UserAchievement).filter(UserAchievement.user_id == user_id).all()]
    all_achievements = db.query(Achievement).all()
    
    sport_checkins = db.query(Checkin).join(Objective).filter(Checkin.user_id == user_id, Objective.category == 'Sport').count()
    intel_checkins = db.query(Checkin).join(Objective).filter(Checkin.user_id == user_id, Objective.category == 'Intelligence').count()
    creat_checkins = db.query(Checkin).join(Objective).filter(Checkin.user_id == user_id, Objective.category == 'Créativité').count()
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
        elif ach.category == 'Créativité' and creat_checkins >= ach.target:
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
    db.flush()

    stats = db.query(UserStats).filter(UserStats.user_id == user_id).first()
    
    if not stats:
        stats = UserStats(user_id=user_id)
        db.add(stats)
        db.flush()

    if stats:
        cat = objective.category.lower() if objective.category else ""
        
        if cat == 'sport': 
            stats.xp_sport = (stats.xp_sport or 0) + (new_checkin.xp_earned or 10)
        elif cat == 'intelligence': 
            stats.xp_intel = (stats.xp_intel or 0) + (new_checkin.xp_earned or 10)
        elif cat == 'créativité' or cat == 'creativite': 
            stats.xp_crea = (stats.xp_crea or 0) + (new_checkin.xp_earned or 10)
        elif cat == 'career': 
            stats.xp_career = (stats.xp_career or 0) + (new_checkin.xp_earned or 10)
        elif cat == 'mental': 
            stats.xp_mental = (stats.xp_mental or 0) + (new_checkin.xp_earned or 10)
            
        if stats.last_checkin_date is None:
            stats.current_streak = 1
        elif stats.last_checkin_date == today:
            pass 
        elif stats.last_checkin_date == today - timedelta(days=1):
            stats.current_streak += 1
        else:
            stats.current_streak = 1
            
        stats.last_checkin_date = today

    db.commit()
    db.refresh(new_checkin)
    
    unlocked_trophies = check_trophies(db, user_id)
    
    return new_checkin, unlocked_trophies