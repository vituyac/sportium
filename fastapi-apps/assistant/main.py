from fastapi import FastAPI
from fastapi.responses import ORJSONResponse
from contextlib import asynccontextmanager
from fastapi.staticfiles import StaticFiles
from core.config import settings
from core.config import DOCS_URL
from core.models import db_helper
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from api import router as api_router
from utils.exceptions import register_exception_handlers
from consumers.assistant import register_ws_routes

@asynccontextmanager
async def lifespan(app: FastAPI):

    yield

    await db_helper.dispose()

app = FastAPI(
    default_response_class=ORJSONResponse,
    docs_url=DOCS_URL,
    lifespan=lifespan
)
        
register_exception_handlers(app)
register_ws_routes(app)

app.include_router(
    api_router,
)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.run.host,
        port=settings.run.port,
        reload=True
    )