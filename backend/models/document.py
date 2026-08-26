import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.database.session import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String(36), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    encounter_id = Column(String(36), ForeignKey("encounters.id", ondelete="SET NULL"), nullable=True, index=True)
    document_type = Column(String(50), nullable=False, default="DISCHARGE_SUMMARY")  # DISCHARGE_SUMMARY, CONSULTATION_NOTE, INITIAL_ASSESSMENT, PROCEDURE_NOTE
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    status = Column(String(50), nullable=False, default="DRAFT")  # DRAFT, FINAL
    created_by = Column(String(255), nullable=False, default="Doctor")
    finalized_at = Column(DateTime, nullable=True)
    finalized_by = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    patient = relationship("Patient", back_populates="documents")
    encounter = relationship("Encounter", back_populates="documents")
