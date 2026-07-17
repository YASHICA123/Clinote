from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from backend.schemas.patient import PatientCreateRequest, PatientUpdateRequest, PatientResponse
from backend.services.patient_service import PatientService
from backend.middleware.auth import require_permission
from backend.utils.responses import standard_response

router = APIRouter(prefix="/patients", tags=["Patients"])

@router.get("")
def get_patients(current_user: dict = Depends(require_permission("view_patient"))):
    data = PatientService.get_active_patients()
    return standard_response(True, "Patients fetched successfully", data)

@router.get("/{patient_id}")
def get_patient(patient_id: str, current_user: dict = Depends(require_permission("view_patient"))):
    patient = PatientService.get_patient(patient_id)
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )
    return standard_response(True, "Patient retrieved successfully", patient)

@router.post("", status_code=status.HTTP_201_CREATED)
def create_patient(payload: PatientCreateRequest, current_user: dict = Depends(require_permission("edit_patient"))):
    record = PatientService.admit_patient(payload.model_dump())
    return standard_response(True, "Patient created successfully", record)

@router.patch("/{patient_id}")
def update_patient(patient_id: str, payload: PatientUpdateRequest, current_user: dict = Depends(require_permission("edit_patient"))):
    patient = PatientService.update_patient(patient_id, payload.model_dump(exclude_unset=True))
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )
    return standard_response(True, "Patient updated successfully", patient)

@router.delete("/{patient_id}", status_code=status.HTTP_200_OK)
def delete_patient(patient_id: str, current_user: dict = Depends(require_permission("delete_records"))):
    success = PatientService.delete_patient(patient_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found"
        )
    return standard_response(True, "Patient archived successfully", None)
