from sqlalchemy import Column, Integer, String, Boolean
from database import Base
from core.model_base import ModelBase


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    property_keyword = Column(String)
