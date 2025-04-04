from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from .base import Base
from sqlalchemy import Boolean
from sqlalchemy import LargeBinary, String, Integer
import enum
from sqlalchemy import Enum
from datetime import date
from sqlalchemy import Date

class GenderEnum(str, enum.Enum):
    male = "male"
    female = "female"
    
class User(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    vk_id: Mapped[int] = mapped_column(unique=True, nullable=True)

    username: Mapped[str] = mapped_column(unique=True, nullable=False)
    email: Mapped[str] = mapped_column(unique=True, nullable=False)
    image: Mapped[str] = mapped_column(String, nullable=True)

    last_name: Mapped[str] = mapped_column(String, nullable=True)
    first_name: Mapped[str] = mapped_column(String, nullable=True)
    middle_name: Mapped[str] = mapped_column(String, nullable=True)
    gender: Mapped[GenderEnum] = mapped_column(Enum(GenderEnum), nullable=True)
    date_of_birth: Mapped[date] = mapped_column(Date, nullable=True)
    height: Mapped[int] = mapped_column(Integer, nullable=True)
    weight: Mapped[int] = mapped_column(Integer, nullable=True)
    training_goal: Mapped[str] = mapped_column(String, nullable=True)
    
    password: Mapped[bytes] = mapped_column(LargeBinary, nullable=False)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
