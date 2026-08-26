import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.database.session import Base

class Encounter(Base):
    __tablename__ = "encounters"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String(36), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    doctor_id = Column(String(255), nullable=True)  # user_id or doctor's name
    doctor_name = Column(String(255), nullable=True)
    department = Column(String(100), nullable=False, default="General Medicine")
    admission_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    discharge_date = Column(DateTime, nullable=True)
    status = Column(String(50), default="ACTIVE", nullable=False)  # ACTIVE, DISCHARGED, CLOSED
    admission_notes = Column(String(1000), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    patient = relationship("Patient", back_populates="encounters")
    clinical_events = relationship("ClinicalEvent", back_populates="encounter", cascade="all, delete-orphan", order_by="ClinicalEvent.created_at")
    documents = relationship("Document", back_populates="encounter", cascade="all, delete-orphan")
