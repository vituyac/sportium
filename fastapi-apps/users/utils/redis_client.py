import redis.asyncio as redis
from core.config import settings

class RedisClient:

    __redis_connect = None

    @classmethod
    async def init(cls):
        if cls.__redis_connect is None:
            cls.__redis_connect = redis.Redis(
                host=settings.redis.host,
                port=settings.redis.port,
                decode_responses=True
            )

    @classmethod
    async def set_data(cls, email: str, data, username: str = None):
        if username:
            await cls.__redis_connect.setex(username, settings.redis.expiration, data)
            await cls.__redis_connect.setex(email, settings.redis.expiration, data)
        else:
            await cls.__redis_connect.setex(email, settings.redis.expiration, data)

    @classmethod
    async def get_data(cls, data: str):

        return await cls.__redis_connect.get(data)
    
    @classmethod
    async def delete_data(cls, data: str):

        return await cls.__redis_connect.delete(data)
    
    @classmethod
    async def close(cls):
        if cls.__redis_connect:
            await cls.__redis_connect.close()
            cls.__redis_connect = None