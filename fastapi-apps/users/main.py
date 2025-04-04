from fastapi import FastAPI
from fastapi.responses import ORJSONResponse
from contextlib import asynccontextmanager
from fastapi.staticfiles import StaticFiles
from core.config import settings
from core.config import DOCS_URL
from core.models import db_helper
import uvicorn

from api import router as api_router
from utils.redis_client import RedisClient
from utils.rabbit_client import rabbitmq_client
from utils.exceptions import register_exception_handlers

@asynccontextmanager
async def lifespan(app: FastAPI):
    await RedisClient.init()
    await rabbitmq_client.connect()

    yield

    await RedisClient.close()
    await rabbitmq_client.close()
    
    await db_helper.dispose()
    
app = FastAPI(
    default_response_class=ORJSONResponse,
    docs_url=DOCS_URL,
    lifespan=lifespan
)

register_exception_handlers(app)

app.include_router(
    api_router,
)
    
app.mount("/api/users/media", StaticFiles(directory="media"), name="media")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.run.host,
        port=settings.run.port,
        reload=True
    )