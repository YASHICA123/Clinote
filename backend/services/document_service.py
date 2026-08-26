from typing import List, Optional, Dict, Any
from datetime import datetime
from sqlalchemy.orm import Session
from backend.models.document import Document
from backend.models.patient import Patient
from backend.schemas.document import DocumentCreate, DocumentUpdate
from backend.services.audit_service import AuditService

class DocumentService:
    @classmethod
    def create_document(
        cls,
        db: Session,
        payload: DocumentCreate,
        current_user: Optional[Dict[str, Any]] = None
    ) -> Document:
        patient = db.query(Patient).filter(Patient.id == payload.patient_id).first()
        if not patient:
            raise ValueError(f"Patient with ID {payload.patient_id} not found")

        author = payload.created_by or (current_user.get("name") if current_user else "Doctor")
        status = payload.status.upper() if payload.status else "DRAFT"

        doc = Document(
            patient_id=payload.patient_id,
            encounter_id=payload.encounter_id,
            document_type=payload.document_type or "DISCHARGE_SUMMARY",
            title=payload.title,
            content=payload.content,
            status=status,
            created_by=author,
            finalized_at=datetime.utcnow() if status == "FINAL" else None,
            finalized_by=author if status == "FINAL" else None
        )
        db.add(doc)
        db.commit()
        db.refresh(doc)

        AuditService.log_action(
            db=db,
            action="DOCUMENT_CREATED",
            resource_type="document",
            resource_id=doc.id,
            user_id=current_user.get("sub") if current_user else None,
            user_email=current_user.get("email") if current_user else None,
            details=f"Created {doc.document_type} '{doc.title}' ({doc.status}) for patient {patient.name}"
        )

        return doc

    @classmethod
    def get_document_by_id(cls, db: Session, document_id: str) -> Optional[Document]:
        return db.query(Document).filter(Document.id == document_id).first()

    @classmethod
    def get_documents_by_patient(cls, db: Session, patient_id: str) -> List[Document]:
        return db.query(Document).filter(Document.patient_id == patient_id).order_by(Document.created_at.desc()).all()

    @classmethod
    def update_document(
        cls,
        db: Session,
        document_id: str,
        payload: DocumentUpdate,
        current_user: Optional[Dict[str, Any]] = None
    ) -> Document:
        doc = db.query(Document).filter(Document.id == document_id).first()
        if not doc:
            raise ValueError("Document not found")

        if doc.status == "FINAL":
            raise PermissionError("Finalized documents are immutable and cannot be modified.")

        update_data = payload.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            if hasattr(doc, key) and value is not None:
                setattr(doc, key, value)

        db.commit()
        db.refresh(doc)

        AuditService.log_action(
            db=db,
            action="DOCUMENT_UPDATED",
            resource_type="document",
            resource_id=doc.id,
            user_id=current_user.get("sub") if current_user else None,
            user_email=current_user.get("email") if current_user else None,
            details=f"Updated draft document '{doc.title}'"
        )

        return doc

    @classmethod
    def finalize_document(
        cls,
        db: Session,
        document_id: str,
        current_user: Optional[Dict[str, Any]] = None
    ) -> Document:
        doc = db.query(Document).filter(Document.id == document_id).first()
        if not doc:
            raise ValueError("Document not found")

        if doc.status == "FINAL":
            return doc

        author = current_user.get("name") if current_user else (doc.created_by or "Doctor")
        doc.status = "FINAL"
        doc.finalized_at = datetime.utcnow()
        doc.finalized_by = author

        db.commit()
        db.refresh(doc)

        AuditService.log_action(
            db=db,
            action="DOCUMENT_FINALIZED",
            resource_type="document",
            resource_id=doc.id,
            user_id=current_user.get("sub") if current_user else None,
            user_email=current_user.get("email") if current_user else None,
            details=f"Finalized document '{doc.title}' by {author}"
        )

        return doc
