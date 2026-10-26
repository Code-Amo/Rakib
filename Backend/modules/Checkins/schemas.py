from pydantic import BaseModel
from datetime import date
from typing import List

class CheckinCreate(BaseModel):
    objective_id: int

class UnlockedTrophy(BaseModel):
    title: str
    rarity: str
    description: str

class CheckinResponse(BaseModel):
    status: str
    xp_gained: int
    unlocked_trophies: List[UnlockedTrophy]