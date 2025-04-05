from pydantic import BaseModel
from typing import List, Optional

class UserSchema(BaseModel):
    id: int
    age: int
    height: str
    weight: str
    training_goal: str
    sex: str
    message: str = None

