from pydantic import BaseModel, EmailStr, ConfigDict, root_validator, ValidationError, Field
from typing import Optional
from enum import Enum
from datetime import date

class BaseSchema(BaseModel):
    @root_validator(pre=True)
    def remove_empty_fields(cls, values):
        if not isinstance(values, dict):
            return values
        return {k: v for k, v in values.items() if v != ""}

class UsernameMixin(BaseModel):
    username: str = Field(..., min_length=4)

class PasswordMixin(BaseModel):
    password: str = Field(..., min_length=8)

class ConfirmMixin(BaseModel):
    confirm: str = Field(..., min_length=8)

class CodeMixin(BaseModel):
    code: str

class ImageMixin(BaseModel):
    image: str

class EmailMixin(BaseModel):
    email: EmailStr

##############################

class LoginSchema(BaseSchema, EmailMixin, PasswordMixin):
    pass

class RegisterSchema(BaseSchema, UsernameMixin, PasswordMixin, EmailMixin):
    pass

class RegisterConfirmSchema(RegisterSchema, ConfirmMixin):
    pass

class EmailCodeSchema(BaseSchema, EmailMixin, CodeMixin):
    pass

class ImageSchema(BaseSchema, ImageMixin):
    pass

class EmailSchema(BaseSchema, EmailMixin):
    pass

class ResetPasswordSchema(BaseSchema, EmailMixin, PasswordMixin, ConfirmMixin, CodeMixin):
    pass

class GenderEnum(str, Enum):
    male = "male"
    female = "female"

class UserSchema(BaseSchema, EmailMixin, ImageMixin, UsernameMixin):
    id: int
    vk_id: Optional[int] = None
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    height: Optional[int] = None
    weight: Optional[int] = None
    training_goal: Optional[str] = None
    gender: Optional[GenderEnum] = None

    model_config = ConfigDict(from_attributes=True, strict=True)
    
class UserUpdateSchema(BaseSchema):
    first_name: str
    middle_name: str
    last_name: str
    date_of_birth: Optional[date]
    height: int
    weight: int
    training_goal: str
    gender: Optional[GenderEnum]

class PasswordEditSchema(BaseSchema, PasswordMixin, ConfirmMixin):
    new_password: str = Field(..., min_length=8)
