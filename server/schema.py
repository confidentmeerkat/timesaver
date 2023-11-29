from pydantic import BaseModel
from typing import Optional


class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    username: str
    email: str


class UserResponse(UserBase):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True
