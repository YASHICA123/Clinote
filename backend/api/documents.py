from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from backend.database.session import get_db
from backend.schemas.document import DocumentCreate, DocumentUpdate
from backend.services.document_service import DocumentService
from backend.middleware.auth import get_current_user_profile, require_permission
from backend.utils.responses import standard_response

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.post("", status_code=status.HTTP_201_CREATED)
def create_document(
    payload: DocumentCreate,
    current_user: dict = Depends(require_permission("create_document")),
    db: Session = Depends(get_db)
):
    try:
        doc = DocumentService.create_document(db, payload, current_user=current_user)
        return standard_response(True, "Document created successfully", {
            "id": doc.id,
            "patient_id": doc.patient_id,
            "encounter_id": doc.encounter_id,
            "document_type": doc.document_type,
            "title": doc.title,
            "content": doc.content,
            "status": doc.status,
            "created_by": doc.created_by,
            "created_at": doc.created_at.isoformat()
        })
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))

@router.get("/{document_id}")
def get_document(
    document_id: str,
    current_user: dict = Depends(get_current_user_profile),
    db: Session = Depends(get_db)
):
    doc = DocumentService.get_document_by_id(db, document_id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    return standard_response(True, "Document retrieved successfully", {
        "id": doc.id,
        "patient_id": doc.patient_id,
        "encounter_id": doc.encounter_id,
        "document_type": doc.document_type,
        "title": doc.title,
        "content": doc.content,
        "status": doc.status,
        "created_by": doc.created_by,
        "finalized_at": doc.finalized_at.isoformat() if doc.finalized_at else None,
        "finalized_by": doc.finalized_by,
        "created_at": doc.created_at.isoformat(),
        "updated_at": doc.updated_at.isoformat()
    })

@router.patch("/{document_id}")
def update_document(
    document_id: str,
    payload: DocumentUpdate,
    current_user: dict = Depends(require_permission("edit_document")),
    db: Session = Depends(get_db)
):
    try:
        doc = DocumentService.update_document(db, document_id, payload, current_user=current_user)
        return standard_response(True, "Document updated successfully", {
            "id": doc.id,
            "patient_id": doc.patient_id,
            "encounter_id": doc.encounter_id,
            "document_type": doc.document_type,
            "title": doc.title,
            "content": doc.content,
            "status": doc.status,
            "created_by": doc.created_by,
            "updated_at": doc.updated_at.isoformat()
        })
    except ValueError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    except PermissionError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))

@router.post("/{document_id}/finalize")
def finalize_document(
    document_id: str,
    current_user: dict = Depends(require_permission("finalize_document")),
    db: Session = Depends(get_db)
):
    try:
        doc = DocumentService.finalize_document(db, document_id, current_user=current_user)
        return standard_response(True, "Document finalized successfully", {
            "id": doc.id,
            "patient_id": doc.patient_id,
            "title": doc.title,
            "status": doc.status,
            "finalized_at": doc.finalized_at.isoformat() if doc.finalized_at else None,
            "finalized_by": doc.finalized_by
        })
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
