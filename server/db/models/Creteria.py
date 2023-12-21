from server.db.schemas import CreteriaBase
from server.db.database import Base
from sqlalchemy import Column
from sqlalchemy.sql.sqltypes import Integer, String
from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.orm.session import Session
from server.db.models import User


class Criteria(Base):
    __tablename__ = "criterias"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    street_number = Column(Integer, index=True)
    street_address = Column(String, index=True)
    city = Column(String, index=True)
    state = Column(String, index=True)
    user = relationship("User", back_populates="criterias")


def create(db: Session, street, street_number, city, state):
    new_creteria = Criteria(
        user_id=1,
        street_number=street_number,
        street_address=street,
        city=city,
        state=state
    )
    db.add(new_creteria)
    db.commit()
    db.refresh(new_creteria)
    return new_creteria
