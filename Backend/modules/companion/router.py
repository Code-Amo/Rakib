from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from . import schemas, service
from modules.identity.router import get_current_user

router = APIRouter()

@router.post("/invite")
def invite_friend(
    invite: schemas.CompanionInvite, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user) 
):
    try:
        return service.send_invite(db, current_user.id, invite.pseudo, invite.category, invite.target_checkins)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/{companionship_id}/accept")
def accept(
    companionship_id: int, 
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user) 
):
    try:
        return service.accept_invite(db, current_user.id, companionship_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
@router.delete("/{companionship_id}")
def remove(
    companionship_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    try:
        return service.remove_companion(db, current_user.id, companionship_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
@router.get("/me")
def get_companions(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    try:
        return service.get_my_companions(db, current_user.id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))