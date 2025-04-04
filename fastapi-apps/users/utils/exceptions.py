from fastapi import Request, FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from .translations import translations

def get_translation_message(error_code: str, lang) -> str:
    return translations[lang].get(error_code, error_code)

class AppError(HTTPException):
    def __init__(self, error_code: str, status_code: int = 400, detail: dict | None = None):
        super().__init__(status_code=status_code, detail=detail)
        self.error_code = error_code
        self.status_code = status_code
        self.detail = detail or {}

def register_exception_handlers(app: FastAPI):
    @app.exception_handler(AppError)
    async def app_error_handler(request: Request, exc: AppError):
        lang = request.query_params.get("lang", "ru")
        message = get_translation_message(exc.error_code, lang)
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": message}
        )

    @app.exception_handler(RequestValidationError)
    async def custom_validation_exception_handler(request: Request, exc: RequestValidationError):
        lang = request.query_params.get("lang", "ru")
        errors = {}
        for error in exc.errors():
            field = error["loc"][-1]
            error_type = error.get("type")
            if error["msg"] == "Field required" or error_type == "value_error.missing":
                errors[field] = get_translation_message("FIELD_REQUIRED", lang)
            else:
                errors[field] = get_translation_message(error["msg"], lang)
        
        return JSONResponse(status_code=422, content=errors)