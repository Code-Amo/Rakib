from sqlalchemy.orm import Session, joinedload
from datetime import datetime, timezone
from .models import Companionship
from modules.identity.models import User
from modules.Calendar.models import Objective
from modules.Checkins.models import Checkin

def send_invite(db: Session, user_id: int, pseudo: str, category: str, target: int):
    friend = db.query(User).filter(User.username == pseudo).first()
    if not friend:
        raise ValueError("Utilisateur introuvable.")
    if friend.id == user_id:
        raise ValueError("Tu ne peux pas t'inviter toi-même.")
        
    existing = db.query(Companionship).filter(
        ((Companionship.user1_id == user_id) & (Companionship.user2_id == friend.id)) |
        ((Companionship.user1_id == friend.id) & (Companionship.user2_id == user_id))
    ).first()
    
    if existing:
        raise ValueError("Une demande existe déjà avec cette personne.")

    new_invite = Companionship(
        user1_id=user_id,
        user2_id=friend.id,
        category=category,
        target_checkins=target,
        status="pending"
    )
    db.add(new_invite)
    db.commit()
    db.refresh(new_invite)
    return new_invite

def accept_invite(db: Session, user_id: int, companionship_id: int):
    companion = db.query(Companionship).filter(
        Companionship.id == companionship_id,
        Companionship.user2_id == user_id, 
        Companionship.status == "pending"
    ).first()
    
    if not companion:
        raise ValueError("Invitation introuvable ou déjà traitée.")
        
    companion.status = "accepted"
    companion.start_date = datetime.now(timezone.utc).date()
    db.commit()
    db.refresh(companion)
    return companion

def remove_companion(db: Session, user_id: int, companionship_id: int):
    companion = db.query(Companionship).filter(Companionship.id == companionship_id).first()

    if not companion:
        raise ValueError("Ce compagnonnage n'existe pas.")
    
    if user_id != companion.user1_id and user_id != companion.user2_id:
        raise ValueError("Tu n'as pas le droit d'effectuer cette action.")

    if companion.status not in ["accepted", "pending"]:
        raise ValueError("Cette action n'est pas possible avec le statut actuel (" + companion.status + ")")

    companion.status = "cancelled"
    db.commit()
    db.refresh(companion)
    
    return {"message": "Action effectuée avec succès."}
def get_my_companions(db: Session, user_id: int):
    companionships = db.query(Companionship).options(
        joinedload(Companionship.user1),
        joinedload(Companionship.user2)
    ).filter(
        (Companionship.user1_id == user_id) | (Companionship.user2_id == user_id)
    ).all()

    accepted = []
    pending = []
    completed = []

    for comp in companionships:
        other_user = comp.user2 if comp.user1_id == user_id else comp.user1
        
        data = {
            "id": comp.id,
            "pseudo": other_user.username if other_user else "Inconnu",
            "category": comp.category,
            "target_checkins": comp.target_checkins,
            "status": comp.status,
            "is_requester": comp.user1_id == user_id,
            "user_checkins": 0,
            "companion_checkins": 0,
        }

        if comp.status in ["accepted", "completed"] and comp.start_date:
            data["user_checkins"] = db.query(Checkin).join(Objective).filter(
                Checkin.user_id == user_id,
                Objective.category == comp.category,
                Checkin.date >= comp.start_date
            ).count()

            other_id = other_user.id if other_user else 0
            data["companion_checkins"] = db.query(Checkin).join(Objective).filter(
                Checkin.user_id == other_id,
                Objective.category == comp.category,
                Checkin.date >= comp.start_date
            ).count()

        if comp.status == "accepted":
            accepted.append(data)
        elif comp.status == "pending":
            pending.append(data)
        elif comp.status == "completed":
            completed.append(data)

    return {
        "accepted": accepted,
        "pending": pending,
        "completed": completed
    }