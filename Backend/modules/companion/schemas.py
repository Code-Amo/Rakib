from pydantic import BaseModel
from datetime import date

class CompanionInvite(BaseModel):
    pseudo: str 
    category: str 
    target_checkins: int = 5

class CompanionResponse(BaseModel):
    id: int
    user1_id: int
    user2_id: int
    category: str
    target_checkins: int
    status: str
    
    class Config:
        from_attributes = True