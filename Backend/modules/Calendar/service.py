from sqlalchemy.orm import Session
from datetime import datetime, timezone
from . import models, schemas
from modules.Checkins.models import Checkin 

def get_objectives(db: Session, user_id: int, today_only: bool = False):
    query = db.query(models.Objective).filter(models.Objective.user_id == user_id)
    
    total_objectives = query.count()
    
    if today_only:
        today_idx = datetime.now().weekday()
        
        query = query.filter(models.Objective.days_of_week.any(today_idx))
    objectives = query.all()
    
    today = datetime.now(timezone.utc).date()
    todays_checkins = db.query(Checkin).filter(
        Checkin.user_id == user_id,
        Checkin.date == today
    ).all()
    
    completed_objective_ids = {c.objective_id for c in todays_checkins}
    
    for obj in objectives:
        setattr(obj, 'completed', obj.id in completed_objective_ids)
        
    return objectives
def delete_objective(db: Session, objective_id: int, user_id: int) -> bool:
    objective = db.query(models.Objective).filter(
        models.Objective.id == objective_id,
        models.Objective.user_id == user_id
    ).first()
    
    if not objective:
        return False
        
    db.delete(objective)
    db.commit()
    return True
def create_objective(db: Session, objective_data: schemas.ObjectiveCreate, user_id: int):
    new_objective = models.Objective(
        user_id=user_id,
        title=objective_data.title,
        category=objective_data.category,
        start_time=objective_data.start_time,
        end_time=objective_data.end_time,
        frequency=objective_data.frequency,
        days_of_week=objective_data.days_of_week
    )
    
    db.add(new_objective)
    db.commit()
    db.refresh(new_objective)
    
    return new_objective