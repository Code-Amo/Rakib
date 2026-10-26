from sqlalchemy.orm import Session
from datetime import datetime, timezone
from . import models, schemas
from modules.Checkins.models import Checkin 

def get_objectives(db: Session, user_id: int, today_only: bool = False):
    query = db.query(models.Objective).filter(models.Objective.user_id == user_id)
    
    total_objectives = query.count()
    print(f"DEBUG: Nombre total d'objectifs en base pour cet user : {total_objectives}")
    
    if today_only:
        today_idx = datetime.now().weekday()
        print(f"DEBUG: On cherche les objectifs du jour (Index Python : {today_idx})")
        
        query = query.filter(models.Objective.days_of_week.any(today_idx))
    else:
        print("DEBUG: Pas de filtre de jour (today_only = False)")
    
    objectives = query.all()
    print(f"DEBUG: Nombre d'objectifs trouvés après filtre : {len(objectives)}")
    
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