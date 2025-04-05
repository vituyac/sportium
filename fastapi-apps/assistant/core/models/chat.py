from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from .base import Base
from sqlalchemy import Boolean
from sqlalchemy import LargeBinary, String, Integer
import enum
from sqlalchemy import Enum
from datetime import date
from sqlalchemy import Date
    
class Chat(Base):
    id: Mapped[int] = mapped_column(primary_key=True)
    
# class Message(Base):