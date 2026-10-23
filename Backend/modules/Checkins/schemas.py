from pydantic import BaseModel
from datetime import date

class CheckinCreate(BaseModel):
    objective_id: int

class CheckinResponse(BaseModel):
    id: int
    objective_id: int
    date: date
    xp_earned: int

    class Config:
        from_attributes = True