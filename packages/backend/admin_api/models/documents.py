from pydantic import BaseModel, EmailStr, Field
from beanie import Document
from datetime import datetime




class Admin(Document):
   full_name: str
   email: EmailStr = Field(index=True, unique=True)
   password: str
   is_admin: bool = True
   createdAt: datetime = Field(default_factory=datetime.now)
   
   class Settings:
       name = "admins" 


class AdminCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    

class LoginRequest(BaseModel):
    email: EmailStr
    password: str   