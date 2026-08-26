from fastapi import APIRouter
from backend.api import (
    auth,
    patients,
    encounters,
    clinical,
    timeline,
    documents,
    audit
)

api_router = APIRouter()

# Register Phase 1 core routers
api_router.include_router(auth.router)
api_router.include_router(patients.router)
api_router.include_router(encounters.router)
api_router.include_router(clinical.router)
api_router.include_router(timeline.router)
api_router.include_router(documents.router)
api_router.include_router(audit.router)
