import aio_pika, json
from core.config import settings

class RabbitMQClient:

    def __init__(self):
        self._connection = None
        self._channel = None

    async def connect(self):
        if not self._connection:
            self._connection = await aio_pika.connect_robust(
                f"amqp://{settings.rabbit.user}:{settings.rabbit.password}@{settings.rabbit.host}/"
            )
            self._channel = await self._connection.channel()

    async def send_message(self, queue_name: str, message: dict):

        if not self._channel:
            await self.connect()

        queue = await self._channel.declare_queue(queue_name, durable=True)
        message_body = json.dumps(message)

        await self._channel.default_exchange.publish(
            aio_pika.Message(
                body=message_body.encode(),
                delivery_mode=aio_pika.DeliveryMode.PERSISTENT
            ),
            routing_key=queue_name,
        )

    async def close(self):
        if self._connection:
            await self._connection.close()
            self._connection = None
            self._channel = None

rabbitmq_client = RabbitMQClient()