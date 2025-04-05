from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, ForeignKey, Enum, Boolean
from .base import Base
from datetime import date
from enum import Enum as PyEnum

class WeekTypeEnum(PyEnum):
    this_week = "this_week"
    next_week = "next_week"

class WeeklyPlan(Base):
    __tablename__ = "weekly_plan"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, nullable=False)
    week_type: Mapped[WeekTypeEnum] = mapped_column(Enum(WeekTypeEnum), nullable=False)

    monday_id: Mapped[int] = mapped_column(ForeignKey("day_plan.id"))
    tuesday_id: Mapped[int] = mapped_column(ForeignKey("day_plan.id"))
    wednesday_id: Mapped[int] = mapped_column(ForeignKey("day_plan.id"))
    thursday_id: Mapped[int] = mapped_column(ForeignKey("day_plan.id"))
    friday_id: Mapped[int] = mapped_column(ForeignKey("day_plan.id"))
    saturday_id: Mapped[int] = mapped_column(ForeignKey("day_plan.id"))
    sunday_id: Mapped[int] = mapped_column(ForeignKey("day_plan.id"))

    monday: Mapped["DayPlan"] = relationship(foreign_keys=[monday_id])
    tuesday: Mapped["DayPlan"] = relationship(foreign_keys=[tuesday_id])
    wednesday: Mapped["DayPlan"] = relationship(foreign_keys=[wednesday_id])
    thursday: Mapped["DayPlan"] = relationship(foreign_keys=[thursday_id])
    friday: Mapped["DayPlan"] = relationship(foreign_keys=[friday_id])
    saturday: Mapped["DayPlan"] = relationship(foreign_keys=[saturday_id])
    sunday: Mapped["DayPlan"] = relationship(foreign_keys=[sunday_id])


class DayPlan(Base):
    __tablename__ = "day_plan"

    id: Mapped[int] = mapped_column(primary_key=True)
    weekday: Mapped[str] = mapped_column(String(10))  # например: "monday"

    meals: Mapped[list["Meal"]] = relationship(back_populates="day_plan", cascade="all, delete-orphan")
    workouts: Mapped[list["WorkoutCategory"]] = relationship(back_populates="day_plan", cascade="all, delete-orphan")


class Meal(Base):
    __tablename__ = "meal"

    id: Mapped[int] = mapped_column(primary_key=True)
    type: Mapped[str] = mapped_column(String(50))
    day_plan_id: Mapped[int] = mapped_column(ForeignKey("day_plan.id"))
    day_plan: Mapped["DayPlan"] = relationship(back_populates="meals")

    dishes: Mapped[list["Dish"]] = relationship(back_populates="meal", cascade="all, delete-orphan")


class Dish(Base):
    __tablename__ = "dish"

    id: Mapped[int] = mapped_column(primary_key=True)
    dish: Mapped[str]
    calories: Mapped[int]
    is_done: Mapped[bool] = mapped_column(Boolean, default=False)

    meal_id: Mapped[int] = mapped_column(ForeignKey("meal.id"))
    meal: Mapped["Meal"] = relationship(back_populates="dishes")


class WorkoutCategory(Base):
    __tablename__ = "workout_category"

    id: Mapped[int] = mapped_column(primary_key=True)
    category: Mapped[str]
    day_plan_id: Mapped[int] = mapped_column(ForeignKey("day_plan.id"))
    day_plan: Mapped["DayPlan"] = relationship(back_populates="workouts")

    tasks: Mapped[list["WorkoutTask"]] = relationship(back_populates="workout_category", cascade="all, delete-orphan")


class WorkoutTask(Base):
    __tablename__ = "workout_task"

    id: Mapped[int] = mapped_column(primary_key=True)
    task: Mapped[str]
    burned_calories: Mapped[int]
    is_done: Mapped[bool] = mapped_column(Boolean, default=False)

    workout_category_id: Mapped[int] = mapped_column(ForeignKey("workout_category.id"))
    workout_category: Mapped["WorkoutCategory"] = relationship(back_populates="tasks")