import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from backend.database.session import Base

class ClinicalEvent(Base):
    __tablename__ = "clinical_events"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id = Column(String(36), ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    encounter_id = Column(String(36), ForeignKey("encounters.id", ondelete="SET NULL"), nullable=True, index=True)
    event_type = Column(String(50), nullable=False, index=True)
    # Types: INITIAL_ASSESSMENT, DAILY_UPDATE, INVESTIGATION, MEDICATION_UPDATE, PROCEDURE, DISCHARGE
    title = Column(String(255), nullable=True)
    content = Column(Text, nullable=False)
    created_by = Column(String(255), nullable=False, default="Doctor")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    patient = relationship("Patient", back_populates="clinical_events")
    encounter = relationship("Encounter", back_populates="clinical_events")
