Если хотите запустить, нужно:  
- изменить nginx/nginx.conf  
- добавить SMTP настройки в fastapi-apps/mailer/.env.template  
- для авторизации через VK: fastapi-apps/users/.env.template — добавить ID VK приложения  

При деплое:  
- .github/workflows/main.yml (для автодеплоя)  
- в api-gateway/main.py в app.add_middleware — добавить домен  

Если всё настроили и мы ничего не забыли здесь написать, проект запускается командой:  
docker compose up --build

**FIGMA:**  
https://www.figma.com/design/wOgpfG5MwMovc8EGaJOwQV/Design-Sportium?node-id=1-11529&t=8YclYcUKFSqyV3mk-1

![Desktop - main](https://github.com/user-attachments/assets/3ec1284f-17ef-4bde-86ce-3c81931e26fd)
