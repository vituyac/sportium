Если хотите запустить, нужно:  
- изменить nginx/nginx.conf  
- добавить SMTP настройки в fastapi-apps/mailer/.env.template  
- для авторизации через VK: fastapi-apps/users/.env.template — добавить ID VK приложения  

При деплое:  
- .github/workflows/main.yml (для автодеплоя)  
- в api-gateway/main.py в app.add_middleware — добавить домен  

Если всё настроили и мы ничего не забыли здесь написать, проект запускается командой:  
docker compose up --build

Удалены ключи для YandexGPT, установлены заглушки в RAG системе, при запросе возвращается заранее сгенерированные YandexGPT планы. Чтобы протестировать RAG, нужно убрать заглушки и добавить в assistant микросервисе (.env) данные для подключения к YandexGPT (генерация может занимать до 1:30 мин). В таком случае вебсокеты могут зависать (данное поведение мы не исправили пока)

**FIGMA:**  
https://www.figma.com/design/wOgpfG5MwMovc8EGaJOwQV/Design-Sportium?node-id=1-11529&t=8YclYcUKFSqyV3mk-1

![Desktop - main](https://github.com/user-attachments/assets/3ec1284f-17ef-4bde-86ce-3c81931e26fd)
