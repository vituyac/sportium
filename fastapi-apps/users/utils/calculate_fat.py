from datetime import date

def calculate_age(birth_date: date) -> int:
    today = date.today()
    return (
        today.year - birth_date.year
        - ((today.month, today.day) < (birth_date.month, birth_date.day))
    )

def calculate_bmi(weight_kg: float, height_cm: float) -> float:
    return round(weight_kg / (height_cm / 100) ** 2, 2)

def calculate_body_fat(bmi: float, age: int, sex: str) -> float:
    if sex.lower() == "male":
        return round(1.20 * bmi + 0.23 * age - 16.2, 2)
    elif sex.lower() == "female":
        return round(1.20 * bmi + 0.23 * age - 5.4, 2)
    else:
        return 0.0