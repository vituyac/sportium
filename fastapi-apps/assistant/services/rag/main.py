import os
from dotenv import load_dotenv
from langchain_community.llms import YandexGPT
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
import asyncio
import re
import json
import faiss
from langchain_community.llms import YandexGPT
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_community.embeddings.yandex import YandexGPTEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.docstore.in_memory import InMemoryDocstore
from langchain.schema import Document
import asyncio
import aiofiles

load_dotenv("./services/rag/")

async def create_chain(template):
    llm = YandexGPT(
        api_key = os.getenv("api_key"),
        folder_id = os.getenv("folder_id"),
        model_name = os.getenv("model_name"),
        model_version = os.getenv("model_version")
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system", template),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{question}")
    ])
    
    llm_chain = prompt | llm
    return llm_chain

async def load_index(index_file, meta_file):
    embeddings = YandexGPTEmbeddings(
        api_key=os.getenv("api_key"),
        folder_id=os.getenv("folder_id"),
        sleep_interval=float(os.getenv("sleep_interval")),
        doc_model_uri=os.getenv("doc_model_uri"),
    )

    index = await asyncio.to_thread(faiss.read_index, index_file)

    async with aiofiles.open(meta_file, 'r', encoding='utf-8') as f:
        data = await f.read()
        metadata = json.loads(data)

    docstore = InMemoryDocstore({
        k: Document(page_content=v.get('text', ''))  
        for k, v in metadata.items()
    })

    index_to_docstore_id = {i: k for i, k in enumerate(docstore._dict.keys())}

    db = FAISS(
        index=index,
        docstore=docstore,
        index_to_docstore_id=index_to_docstore_id,
        embedding_function=embeddings
    )

    return db


async def relevant_data(db, message, count):
    
    docs = await asyncio.to_thread(db.similarity_search, message, count)

    content = re.sub(r'\n{2}', ' ', '\n'.join([doc.page_content for doc in docs]))

    return content


async def ai_request(user_message, template, chat_history):
    # генерация недельного плана
    chain = await create_chain(template)
    
    db = await load_index('services/rag/bin/index.bin', 'services/rag/meta/meta.json')
    context = await relevant_data(db, user_message, 5)
    
    response = await chain.ainvoke({
        "question": user_message,
        "chat_history": chat_history,
        "context": context
    })

    if hasattr(response, "content"):
        response = response.content
    return response.replace("**", "").replace("* ", "")

# вытаскиваем только иерархию ключей в json-ах
def compare_weekly_plan_structures(plan1, plan2):
    def check_meals_structure(meals):
        if not isinstance(meals, dict):
            return False
        for meal_name, dishes in meals.items():
            if not isinstance(dishes, list):
                return False
            for dish in dishes:
                if not isinstance(dish, dict):
                    return False
                if set(dish.keys()) != {"dish", "calories"}:
                    return False
        return True

    def check_workout_structure(workout):
        if not isinstance(workout, list):
            return False
        for workout_item in workout:
            if not isinstance(workout_item, dict):
                return False
            if set(workout_item.keys()) != {"category", "tasks"}:
                return False
            tasks = workout_item["tasks"]
            if not isinstance(tasks, list):
                return False
            for task in tasks:
                if not isinstance(task, dict):
                    return False
                if set(task.keys()) != {"task", "burned_calories"}:
                    return False
        return True

    def check_day_structure(day_data):
        if not isinstance(day_data, dict):
            return False
        if set(day_data.keys()) != {"meals", "workout"}:
            return False
        return check_meals_structure(day_data["meals"]) and check_workout_structure(day_data["workout"])

    # Проверяем наличие weekly_plan
    if set(plan1.keys()) != {"weekly_plan"} or set(plan2.keys()) != {"weekly_plan"}:
        return False

    week1 = plan1["weekly_plan"]
    week2 = plan2["weekly_plan"]

    if set(week1.keys()) != set(week2.keys()):
        return False  # например, если один план без "sunday"

    for day in week1:
        if not check_day_structure(week1[day]) or not check_day_structure(week2[day]):
            return False

    return True

# проверка формата JSON на нужный
async def check_json(data2):
    with open('services/rag/example.json', 'r', encoding='utf-8') as f1:
        data1 = json.load(f1)

    return compare_weekly_plan_structures(data1, data2)


# передаем данные для создания запроса
async def prepare_ai_request(activity, presonal_data,  temp_json=None, user_message=None):
    # типы запросов: createTodayPlan - генерация TodayPlan, 
    # editPlan - редактирование ТЕКУЩЕГО плана на основе сообщений от пользователя в чате,
    # createFuturePlan - создание FuturePlan на основе TodayPlan
    
    chat_history = [] # в дальнейшем загрузится история

    # переведем для языковой модели ключи персональных данныx
    key_map = {
        "sex": "пол человека",
        "age": "возраст человека",
        "height": "рост человека",
        "weight": "вес человека",
        "training_goal": "цель человека"
    }
    presonal_data = {key_map.get(k, k): v for k, v in presonal_data.items()}

    if activity == "createTodayPlan": # генерация TodayPlan
        # в качестве промта отправим модели персональные данные пользователя
        user_message = "; ".join(f"{k}: {v}" for k, v in presonal_data.items())
        # никакой истории нет
        chat_history = []

        # загрузим пример нужного JSON (только один день)
        with open('services/rag/example_day.json', 'r', encoding='utf-8') as file:
            example_json = json.load(file)
        # делаем json строкой
        example_json = json.dumps(example_json)
        example_json = example_json.replace("{", "{{").replace("}", "}}")
    
        template = f"""Ты фитнесс-ассисент. Необходимо пользователю сформировать недельный план тренировок и питания на основе 
        на основе переданных персональных данных (пол, возраст, рост, вес, цель).
        Вернуть данный план строго с такими же ключами, только нужно добавить структуру для  tuesday, wednesday, thursday, friday, saturday, sunday
        как и у этого json: {example_json}.
        Нельзя изменять никакие ключи и никакие новые ключи нельзя создавать.  Ты генереируешь только новые данные.
        category - категория упражнений на день, calories_burned - кол-во соженных калорий после этой тренировки, dish -  блюдо для данного типа приема пищи, 
        calories - сколько калорий содержится в данном приеме пищи. tasks - массив с упражнениями на данную категорию. task в tasks может быть от 1 до 2, category в workout тоже от 1 до 2 делаем, dish в приеме пищи тоже от 1 до 2. 
         workout нигде не должен быть пустым.
        Тебе нужно только новые данные создавать на основе переданных персональных данных пользователя, 
         Блюда и тренировки придумывать тебе и немного брать из данных, которые будут идти после двоеточия (можешь не брать отсюда): {{context}}"""
    elif activity == "editPlan": # редактирование текущего плана
        # делаем текущий json строкой 
        temp_json = json.dumps(temp_json)
        temp_json = temp_json.replace("{", "{{").replace("}", "}}")
        chat_history = [temp_json]

        template = f"""Ты фитнесс-ассисент. Данные пользователя: {"; ".join(f"{k}: {v}" for k, v in presonal_data.items())} 
        Пользователь написал тебе сообщение с изменением плана. План в истории твоих сообщений с пользователем.
        Тебе необходимо изменить план в соответсвии с пользователем. Вернуть полный json строго с такой же структурой ключей, это самое важное.
        Придумай сам блюда или тренировки или можешь брать из контекста: {{context}}
        """
    elif activity == "createFuturePlan": # создание FuturePlan на основе TodayPlan
        # в качестве промта отправим модели персональные данные пользователя
        user_message = "; ".join(f"{k}: {v}" for k, v in presonal_data.items())
        # никакой истории нет
        chat_history = []

        # делаем json строкой
        temp_json = json.dumps(temp_json)
        temp_json = temp_json.replace("{", "{{").replace("}", "}}")

        template = f"""Ты фитнес-ассистент. Тебе нужно составить недельный план тренировок и питания на основе следующих персональных данных: возраста, роста, веса, цели и пола, 
        а также учитывая данные из прошлого недельного плана в формате JSON: {temp_json}. 
        План должен быть сформирован по строгой структуре, которая представлена в прошлом плане JSON.
        1. category — категория упражнения или тип пищи (не изменяй ключи и не создавай новых).
        2. tasks — список упражнений для данной категории на конкретный день.
        3. calories_burned — количество сожженных калорий за тренировку.
        4. dish — название блюда для каждого приема пищи.
        5. calories — количество калорий в данном блюде.
        Важно:
        - Тренировки и блюда должны быть разнообразными и отличаться от тех, что были в прошлом плане (не использовать однотипные блюда и упражнения).
        - Типы блюд и категории упражнений должны быть уникальными и совершенно новыми по сравнению с предыдущими (не похожими).
        - Вся информация должна быть сгенерирована тобой или основана на следующих данных (смотри контекст): {{context}}.
        """
    # отправляем запрос к модели
    try:
        result = await asyncio.wait_for(ai_request(user_message, template, chat_history), timeout=60.0)
    except asyncio.TimeoutError:
        print("GPT отвечал дольше 1 минуты")
        result = ''

    print("Ответ GPT:")
    print(result)
    # преобразуем строку в json-формат
    try:
        # Убираем кодовые блоки ```json и ```
        result = re.sub(r"^```json|```$", "", result, flags=re.MULTILINE).strip()
        result_json = json.loads(result)
    except:
        print("GPT прислал НЕ JSON")
        if activity == "editPlan": # редактирование текущего плана - 
            return temp_json
        elif activity == "createTodayPlan" or activity == "createFuturePlan": # генерация TodayPlan или FuturePlan
            with open('services/rag/cache_plan.json', 'r', encoding='utf-8') as file:
                result_json = json.load(file)
            return result_json # вернуть закешированный план в качестве нового
    
    check = await check_json(result_json)
   
    if check:
        print('GPT вернул правильный JSON')
        return result_json
    else:
        print('GPT вернул неправильный формат JSON')
        if activity == "editPlan": # редактирование текущего плана - 
            return temp_json
        elif activity == "createTodayPlan" or activity == "createFuturePlan": # генерация TodayPlan или FuturePlan
            with open('services/rag/cache_plan.json', 'r', encoding='utf-8') as file:
                result_json = json.load(file)
            return result_json # вернуть закешированный план в качестве нового


