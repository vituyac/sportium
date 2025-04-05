from enum import Enum
from pydantic import BaseModel
from typing import Literal
from typing import List, Optional

class WeekTypeEnum(str, Enum):
    this_week = "this_week"
    next_week = "next_week"

class DishSchema(BaseModel):
    dish: str
    calories: int
    is_done: bool = False

class MealSchema(BaseModel):
    type: str
    dishes: List[DishSchema]

class WorkoutTaskSchema(BaseModel):
    task: str
    burned_calories: int
    is_done: bool = False

class WorkoutCategorySchema(BaseModel):
    category: str
    tasks: List[WorkoutTaskSchema]

class DayPlanSchema(BaseModel):
    weekday: str
    meals: List[MealSchema]
    workouts: List[WorkoutCategorySchema]

class WeeklyPlanCreateSchema(BaseModel):
    user_id: int
    week_type: WeekTypeEnum
    monday: Optional[DayPlanSchema]
    tuesday: Optional[DayPlanSchema]
    wednesday: Optional[DayPlanSchema]
    thursday: Optional[DayPlanSchema]
    friday: Optional[DayPlanSchema]
    saturday: Optional[DayPlanSchema]
    sunday: Optional[DayPlanSchema]

class WeeklyPlanReadSchema(WeeklyPlanCreateSchema):
    id: int

class PlanRequest(BaseModel):
    user_id: int
    week: Literal["this", "next"]

class MarkDoneRequest(BaseModel):
    item_id: int
    item_type: Literal["dish", "task"]
    user_id: int
    week: Literal["this", "next"]