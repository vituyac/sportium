from fastapi import FastAPI
from fastapi.responses import ORJSONResponse
import uvicorn
from api import router as api_router
from core.config import settings
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    default_response_class=ORJSONResponse,
    docs_url=None, 
    redoc_url=None,      
    openapi_url=None
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost"], # Добавьте домен
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

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
