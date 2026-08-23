from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from backend.schemas.notes import DailyNoteCreateRequest, DailyNoteUpdateRequest
from backend.services.daily_notes_service import DailyNotesService
from backend.middleware.auth import require_permission
from backend.utils.responses import standard_response

router = APIRouter(prefix="/daily-notes", tags=["Daily Notes"])

@router.get("/{patient_id}")
def get_notes(patient_id: str, current_user: dict = Depends(require_permission("view_patient"))):
    data = DailyNotesService.get_notes(patient_id)
    return standard_response(True, "Daily notes retrieved successfully", data)

@router.post("", status_code=status.HTTP_201_CREATED)
def create_note(payload: DailyNoteCreateRequest, current_user: dict = Depends(require_permission("edit_patient"))):
    note_data = payload.model_dump()
    note_data["created_by"] = current_user.get("name", "Staff")
    data = DailyNotesService.create_note(note_data)
    return standard_response(True, "Daily note created successfully", data)

@router.patch("/{note_id}")
def update_note(note_id: str, payload: DailyNoteUpdateRequest, current_user: dict = Depends(require_permission("edit_patient"))):
    res = DailyNotesService.update_note(note_id, payload.model_dump(exclude_unset=True))
    if not res:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found"
        )
    return standard_response(True, "Daily note updated successfully", res)

@router.delete("/{note_id}")
def delete_note(note_id: str, current_user: dict = Depends(require_permission("delete_records"))):
    success = DailyNotesService.delete_note(note_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found or could not be deleted"
        )
    return standard_response(True, "Daily note deleted successfully", None)
