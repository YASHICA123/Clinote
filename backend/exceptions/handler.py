from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from backend.config.logging import errors_logger
import traceback

async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    tb = traceback.format_exc()
    errors_logger.error(f"Global Exception on {request.url.path}: {str(exc)}\n{tb}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "data": None,
            "message": "An unexpected error occurred. Please contact system support."
        }
    )

async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    errors_logger.warning(f"HTTP Exception on {request.url.path}: Code {exc.status_code} - {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "data": None,
            "message": exc.detail
        }
    )

async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    errors = exc.errors()
    # Format a readable error summary
    error_msgs = []
    for err in errors:
        loc = " -> ".join(str(l) for l in err.get("loc", []))
        msg = err.get("msg", "Validation error")
        error_msgs.append(f"[{loc}]: {msg}")
    
    summary = "; ".join(error_msgs)
    errors_logger.warning(f"Validation Error on {request.url.path}: {summary}")
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "data": {"errors": errors},
            "message": f"Validation failed: {summary}"
        }
    )
