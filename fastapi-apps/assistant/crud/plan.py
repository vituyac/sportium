from sqlalchemy import select, delete
from sqlalchemy.orm import selectinload
from datetime import datetime
from zoneinfo import ZoneInfo
from datetime import date
from core.models import (
    WeeklyPlan, DayPlan, Meal, Dish,
    WorkoutCategory, WorkoutTask,
    WeekTypeEnum
)
from fastapi import HTTPException

WEEKDAYS = {
    0: "monday",
    1: "tuesday",
    2: "wednesday",
    3: "thursday",
    4: "friday",
    5: "saturday",
    6: "sunday",
}

async def save_weekly_plan_to_db(user_id: int, plan: dict, week_type: WeekTypeEnum, session):
    existing_plan_result = await session.execute(
        select(WeeklyPlan)
        .where(WeeklyPlan.user_id == user_id, WeeklyPlan.week_type == week_type)
        .options(
            selectinload(WeeklyPlan.monday),
            selectinload(WeeklyPlan.tuesday),
            selectinload(WeeklyPlan.wednesday),
            selectinload(WeeklyPlan.thursday),
            selectinload(WeeklyPlan.friday),
            selectinload(WeeklyPlan.saturday),
            selectinload(WeeklyPlan.sunday),
        )
    )
    existing_plan = existing_plan_result.scalar_one_or_none()

    if existing_plan:
        for day in [
            existing_plan.monday, existing_plan.tuesday, existing_plan.wednesday,
            existing_plan.thursday, existing_plan.friday,
            existing_plan.saturday, existing_plan.sunday
        ]:
            if day:
                await session.delete(day)
        await session.delete(existing_plan)
        await session.flush()

    day_ids = {}

    for day_name, day_data in plan["weekly_plan"].items():
        day_plan = DayPlan(weekday=day_name)
        session.add(day_plan)
        await session.flush()

        for meal_type, dishes in day_data["meals"].items():
            meal = Meal(type=meal_type, day_plan_id=day_plan.id)
            session.add(meal)
            await session.flush()

            for dish_data in dishes:
                dish = Dish(
                    dish=dish_data["dish"],
                    calories=dish_data["calories"],
                    is_done=dish_data.get("is_done", False),
                    meal_id=meal.id
                )
                session.add(dish)

        for workout_cat in day_data["workout"]:
            workout = WorkoutCategory(category=workout_cat["category"], day_plan_id=day_plan.id)
            session.add(workout)
            await session.flush()

            for task in workout_cat["tasks"]:
                workout_task = WorkoutTask(
                    task=task["task"],
                    burned_calories=task["burned_calories"],
                    is_done=task.get("is_done", False),
                    workout_category_id=workout.id
                )
                session.add(workout_task)

        day_ids[day_name] = day_plan.id

    weekly_plan = WeeklyPlan(
        user_id=user_id,
        week_type=week_type,
        monday_id=day_ids.get("monday"),
        tuesday_id=day_ids.get("tuesday"),
        wednesday_id=day_ids.get("wednesday"),
        thursday_id=day_ids.get("thursday"),
        friday_id=day_ids.get("friday"),
        saturday_id=day_ids.get("saturday"),
        sunday_id=day_ids.get("sunday")
    )

    session.add(weekly_plan)
    await session.commit()
    await session.refresh(weekly_plan)

async def get_plan(session, user_id: int, week: str, include_ids: bool = False) -> dict:
    week_type = WeekTypeEnum.this_week if week == "this" else WeekTypeEnum.next_week

    result = await session.execute(
        select(WeeklyPlan)
        .where(WeeklyPlan.user_id == user_id, WeeklyPlan.week_type == week_type)
        .options(
            *[
                selectinload(getattr(WeeklyPlan, day)).selectinload(DayPlan.meals).selectinload(Meal.dishes)
                for day in ("monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday")
            ] +
            [
                selectinload(getattr(WeeklyPlan, day)).selectinload(DayPlan.workouts).selectinload(WorkoutCategory.tasks)
                for day in ("monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday")
            ]
        )
    )

    weekly_plan_obj = result.scalar_one_or_none()
    if not weekly_plan_obj:
        return {"weekly_plan": {}}

    def serialize_day(day: DayPlan) -> dict:
        return {
            "meals": {
                meal.type: [
                    {
                        **({"id": d.id} if include_ids else {}),
                        "dish": d.dish,
                        "calories": d.calories,
                        **({"is_done": d.is_done} if include_ids else {})
                    }
                    for d in meal.dishes
                ]
                for meal in day.meals
            },
            "workout": [
                {
                    "category": wc.category,
                    "tasks": [
                        {
                            **({"id": t.id} if include_ids else {}),
                            "task": t.task,
                            "burned_calories": t.burned_calories,
                            **({"is_done": t.is_done} if include_ids else {})
                        }
                        for t in wc.tasks
                    ]
                } for wc in day.workouts
            ]
        }

    return {
        "weekly_plan": {
            "monday": serialize_day(weekly_plan_obj.monday),
            "tuesday": serialize_day(weekly_plan_obj.tuesday),
            "wednesday": serialize_day(weekly_plan_obj.wednesday),
            "thursday": serialize_day(weekly_plan_obj.thursday),
            "friday": serialize_day(weekly_plan_obj.friday),
            "saturday": serialize_day(weekly_plan_obj.saturday),
            "sunday": serialize_day(weekly_plan_obj.sunday),
        }
    }

async def get_today_plan(session, user_id: int, week: str = "this", include_ids: bool = False) -> dict:
    week_type = WeekTypeEnum.this_week if week == "this" else WeekTypeEnum.next_week
    moscow_date = datetime.now(ZoneInfo("Europe/Moscow")).date()
    today_name = WEEKDAYS[moscow_date.weekday()]

    result = await session.execute(
        select(WeeklyPlan)
        .where(WeeklyPlan.user_id == user_id, WeeklyPlan.week_type == week_type)
        .options(
            selectinload(getattr(WeeklyPlan, today_name)).selectinload(DayPlan.meals).selectinload(Meal.dishes),
            selectinload(getattr(WeeklyPlan, today_name)).selectinload(DayPlan.workouts).selectinload(WorkoutCategory.tasks),
        )
    )

    weekly_plan_obj = result.scalar_one_or_none()
    if not weekly_plan_obj:
        return {"detail": "План на сегодня не найден"}

    today_plan: DayPlan = getattr(weekly_plan_obj, today_name)

    total_dishes = 0
    done_dishes = 0
    total_tasks = 0
    done_tasks = 0

    def serialize_day(day: DayPlan) -> dict:
        nonlocal total_dishes, done_dishes, total_tasks, done_tasks

        meals_serialized = {}
        for meal in day.meals:
            dishes = []
            for d in meal.dishes:
                total_dishes += 1
                if d.is_done:
                    done_dishes += 1
                dish_obj = {
                    **({"id": d.id} if include_ids else {}),
                    "dish": d.dish,
                    "calories": d.calories,
                    **({"is_done": d.is_done} if include_ids else {})
                }
                dishes.append(dish_obj)
            meals_serialized[meal.type] = dishes

        workouts_serialized = []
        for wc in day.workouts:
            tasks = []
            for t in wc.tasks:
                total_tasks += 1
                if t.is_done:
                    done_tasks += 1
                task_obj = {
                    **({"id": t.id} if include_ids else {}),
                    "task": t.task,
                    "burned_calories": t.burned_calories,
                    **({"is_done": t.is_done} if include_ids else {})
                }
                tasks.append(task_obj)
            workouts_serialized.append({
                "category": wc.category,
                "tasks": tasks
            })

        return {
            "meals": meals_serialized,
            "workout": workouts_serialized
        }

    plan_data = serialize_day(today_plan)

    meal_progress = int((done_dishes / total_dishes) * 100) if total_dishes else 0
    workout_progress = int((done_tasks / total_tasks) * 100) if total_tasks else 0

    return {
        "day": today_name,
        "date": str(date.today()),
        "plan": plan_data,
        "progress": {
            "meals": meal_progress,
            "workout": workout_progress
        }
    }

async def mark_item_done(session, user_id, item_type, item_id, week):
    moscow_date = datetime.now(ZoneInfo("Europe/Moscow")).date()
    today_name = WEEKDAYS[moscow_date.weekday()]
    week_type = WeekTypeEnum.this_week if week == "this" else WeekTypeEnum.next_week

    result = await session.execute(
        select(WeeklyPlan)
        .where(WeeklyPlan.user_id == user_id, WeeklyPlan.week_type == week_type)
        .options(
            selectinload(getattr(WeeklyPlan, today_name))
        )
    )

    weekly_plan = result.scalar_one_or_none()
    if not weekly_plan:
        raise HTTPException(status_code=404, detail="План не найден")

    day_plan = getattr(weekly_plan, today_name)
    if not day_plan:
        raise HTTPException(status_code=404, detail="План на сегодня не найден")

    if item_type == "dish":
        result = await session.execute(
            select(Dish).where(Dish.id == item_id, Dish.meal.has(Meal.day_plan_id == day_plan.id))
        )
        item = result.scalar_one_or_none()
    else:
        result = await session.execute(
            select(WorkoutTask).where(WorkoutTask.id == item_id, WorkoutTask.workout_category.has(WorkoutCategory.day_plan_id == day_plan.id))
        )
        item = result.scalar_one_or_none()

    if not item:
        raise HTTPException(status_code=404, detail=f"{item_type.title()} не найден")

    item.is_done = True
    session.add(item)
    await session.commit()

    today_plan = await get_today_plan(session=session, user_id=user_id, week=week, include_ids=True)
    return today_plan