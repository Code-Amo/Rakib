from pydantic import BaseModel, field_validator
from typing import List
from datetime import datetime

class ObjectiveBase(BaseModel):
    title: str
    category: str
    start_time: str
    end_time: str
    frequency: str
    days_of_week: List[int]

    @field_validator('end_time')
    def check_times(cls, end_time, info):
        start_time = info.data.get('start_time')
        if start_time and end_time <= start_time:
            raise ValueError("L'heure de fin doit être supérieure à l'heure de début")
        return end_time

class ObjectiveCreate(ObjectiveBase):
    pass 

class ObjectiveResponse(ObjectiveBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True 