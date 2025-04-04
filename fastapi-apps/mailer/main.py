from fastapi import FastAPI
from fastapi.responses import ORJSONResponse
import uvicorn
from contextlib import asynccontextmanager
from core.config import settings
import asyncio
from consumers.mailer import consume

@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(consume())
    yield
    task.cancel()
    
app = FastAPI(
    default_response_class=ORJSONResponse,
    docs_url=None, 
    redoc_url=None,      
    openapi_url=None,
    lifespan=lifespan
)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.run.host,
        port=settings.run.port,
        reload=True
    )