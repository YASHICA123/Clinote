import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException

from backend.config.settings import settings
from backend.database.session import init_db, SessionLocal
from backend.api.router_v1 import api_router
from backend.middleware.request_id import RequestIDMiddleware
from backend.exceptions.handler import (
    global_exception_handler,
    http_exception_handler,
    validation_exception_handler
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize Database tables and seed initial data
    init_db()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Clinote Clinical Platform - Phase 1 Foundation",
    version="1.0.0",
    lifespan=lifespan
)

# 1. Register Request ID Middleware
app.add_middleware(RequestIDMiddleware)

# 2. Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Register Global Exception Handlers
app.add_exception_handler(Exception, global_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)

# 4. Register versioned v1 router
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "phase": "Phase 1: Foundation",
        "docs_url": "/docs",
        "health_url": "/health"
    }

@app.get("/health")
def health_check():
    db_status = "disconnected"
    is_healthy = True
    
    try:
        db = SessionLocal()
        from sqlalchemy import text
        db.execute(text("SELECT 1"))
        db.close()
        db_status = "connected"
    except Exception as e:
        is_healthy = False
        db_status = f"error: {str(e)}"
        
    return {
        "status": "healthy" if is_healthy else "unhealthy",
        "database": db_status,
        "version": "1.0.0",
        "phase": "Phase 1: Foundation"
    }

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="0.0.0.0", port=settings.API_PORT, reload=True)
