from pydantic import BaseModel, EmailStr
from typing import Optional


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    target_role: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str