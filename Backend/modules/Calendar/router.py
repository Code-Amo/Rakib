from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from core.database import get_db
from core.security import get_current_user
from . import schemas, service

router = APIRouter()

@router.get("/get", response_model=List[schemas.ObjectiveResponse])
def read_objectives(
    today_only: bool = False,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return service.get_objectives(db, current_user.id, today_only)

@router.post("/post", response_model=schemas.ObjectiveResponse, status_code=status.HTTP_201_CREATED)
def create_new_objective(
    objective: schemas.ObjectiveCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return service.create_objective(db, objective, current_user.id)

@router.delete("/{objective_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_objective(
    objective_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    success = service.delete_objective(db, objective_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Objectif non trouvé ou non autorisé")
    return None