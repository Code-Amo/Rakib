from pydantic import BaseModel, EmailStr, ConfigDict

class UserBase(BaseModel):
    email: EmailStr
    username: str
    name: str

class UserCreate(UserBase):
    password: str
    accepted_cgu: bool

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class VerifyCode(BaseModel):
    email: EmailStr
    code: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPassword(BaseModel):
    email: EmailStr
    new_password: str
    reset_token: str

class AvatarUpdate(BaseModel):
    avatar_url: str
class UserUpdateName(BaseModel):
    name: str

class UserUpdatePassword(BaseModel):
    old_password: str
    new_password: str