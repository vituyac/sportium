import asyncio
import json
import aio_pika
import aiosmtplib
from email.mime.text import MIMEText
from core.config import settings

async def send_email(recipient_email: str, code: str, email_type: int):
    msg = MIMEText(code)
    if email_type == 1: msg["Subject"] = "Подтверждение регистрации"
    elif email_type == 2: msg["Subject"] = "Восстановление пароля"
    elif email_type == 3: msg["Subject"] = "Данные от аккаунта"
    msg["From"] = settings.smtp.email
    msg["To"] = recipient_email

    try:
        await aiosmtplib.send(
            msg,
            hostname=settings.smtp.server,
            port=settings.smtp.port,
            username=settings.smtp.user,
            password=settings.smtp.password,
            use_tls=True,
            start_tls=False,
        )
    except Exception as e:
        print(e)


async def consume():
    try:
        connection = await aio_pika.connect_robust(f"amqp://{settings.rabbit.user}:{settings.rabbit.password}@{settings.rabbit.host}/")
        async with connection:
            channel = await connection.channel()

            queue = await channel.declare_queue(settings.rabbit.queue, durable=True)

            async for message in queue:
                async with message.process():
                    try:
                        data = json.loads(message.body)

                        email = data.get("email")
                        code = data.get("code")
                        emai_type = int(data.get("type"))

                        if not email or not code:
                            continue

                        await send_email(email, code, emai_type)

                    except Exception as e:
                        print(e)

    except Exception as e:
        print(e)