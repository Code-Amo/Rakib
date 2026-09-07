from pydantic import BaseModel, EmailStr, ConfigDict

# email and username
class UserBase(BaseModel):
    email: EmailStr
    username: str

# password
class UserCreate(UserBase):
    password: str

# Schema reponse
class UserResponse(UserBase):
    id: int
    xp: int
    level: int

    model_config = ConfigDict(from_attributes=True)