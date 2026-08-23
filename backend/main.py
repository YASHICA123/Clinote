import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException

from backend.config.settings import settings
from backend.api.router_v1 import api_router
from backend.middleware.request_id import RequestIDMiddleware
from backend.exceptions.handler import (
    global_exception_handler,
    http_exception_handler,
    validation_exception_handler
)
from backend.database.supabase import supabase

# Register event listeners
from backend.events import patient_events, timeline_events, audit_events

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Layered Healthcare Clinical AI Backend",
    version="1.0.0"
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
        "docs_url": "/docs",
        "health_url": "/health"
    }

@app.get("/health")
def health_check():
    db_status = "disconnected"
    storage_status = "disconnected"
    is_healthy = True
    
    try:
        if supabase:
            # Check Database connectivity by pinging patient_master
            supabase.table("patient_master").select("patient_id").limit(1).execute()
            db_status = "connected"
    except Exception:
        is_healthy = False
        
    try:
        if supabase:
            # Check Storage connectivity by querying the admissions bucket
            supabase.storage.get_bucket("admissions")
            storage_status = "connected"
    except Exception:
        is_healthy = False
        
    status_str = "healthy" if is_healthy and db_status == "connected" and storage_status == "connected" else "unhealthy"
    
    return {
        "status": status_str,
        "database": db_status,
        "storage": storage_status,
        "version": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=settings.API_PORT, reload=True)
