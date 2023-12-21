from pydantic import BaseModel
from typing import List


class CreteriaBase(BaseModel):
    street_number: int
    street_address: str
    city: str
    state: str
