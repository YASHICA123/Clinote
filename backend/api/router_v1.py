from fastapi import APIRouter
from backend.api import (
    auth,
    patients,
    admission,
    timeline,
    medications,
    investigations,
    voice,
    reports,
    generate,
    daily_notes,
    clinical_history,
    consultations,
    procedures
)

api_router = APIRouter()

# Include all sub-routers
api_router.include_router(auth.router)
api_router.include_router(patients.router)
api_router.include_router(admission.router)
api_router.include_router(timeline.router)
api_router.include_router(medications.router)
api_router.include_router(investigations.router)
api_router.include_router(voice.router)
api_router.include_router(reports.router)
api_router.include_router(generate.router)
api_router.include_router(daily_notes.router)
api_router.include_router(clinical_history.router)
api_router.include_router(consultations.router)
api_router.include_router(procedures.router)
