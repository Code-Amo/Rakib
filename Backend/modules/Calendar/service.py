from sqlalchemy.orm import Session
from . import models, schemas

def get_objectives(db: Session, user_id: int):
    return db.query(models.Objective).filter(models.Objective.user_id == user_id).all()

def create_objective(db: Session, objective: schemas.ObjectiveCreate, user_id: int):
    db_obj = models.Objective(
        **objective.model_dump(),
        user_id=user_id 
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete_objective(db: Session, objective_id: int, user_id: int):
    db_obj = db.query(models.Objective).filter(
        models.Objective.id == objective_id, 
        models.Objective.user_id == user_id
    ).first()
    
    if db_obj:
        db.delete(db_obj)
        db.commit()
        return True
    return False