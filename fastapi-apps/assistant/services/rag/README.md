prepare_ai_request(activity, presonal_data,  temp_json=None, user_message=None) - получение нужного плана JSON


__Создание TodayPlan__
prepare_ai_request(activity, presonal_data)

activity = "createTodayPlan"
# пример персональных данных
presonal_data = {
    "sex": "мужчина",
    "age": "53 года",
    "height": "179 см",
    "weight": "89 кг",
    "training_goal": "похудеть"
}


__Создание FuturePlan__
prepare_ai_request(activity, presonal_data, temp_json)

activity = "createFuturePlan"
# пример персональных данных
presonal_data = {
    "sex": "мужчина",
    "age": "53 года",
    "height": "179 см",
    "weight": "89 кг",
    "training_goal": "похудеть"
}
# передаем TodayPlan в переменной temp_json
temp_json = today_plan_json


__Редактирование текущего плана__
prepare_ai_request(activity, presonal_data, temp_json, user_message)

activity = "editPlan"
# пример персональных данных
presonal_data = {
    "sex": "мужчина",
    "age": "53 года",
    "height": "179 см",
    "weight": "89 кг",
    "training_goal": "похудеть"
}
# передаем текущий план в переменной JSON
temp_json = today_plan_json or future_plan_json
# пример сообщения пользователя
user_message = "я не хочу есть омлет утром"


!! в temp_json НЕ передаем поля "is_done"

