import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime
from sqlalchemy.orm import relationship
from backend.database.session import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    hospital_patient_id = Column(String(100), unique=True, index=True, nullable=False)  # MRN
    name = Column(String(255), nullable=False)
    date_of_birth = Column(String(50), nullable=True)  # YYYY-MM-DD
    gender = Column(String(50), nullable=False, default="other")  # male, female, other
    age = Column(Integer, nullable=True)
    status = Column(String(50), default="ACTIVE", nullable=False)  # ACTIVE, ICU, WARD, DISCHARGED
    department = Column(String(100), nullable=True, default="General Medicine")
    bed_number = Column(String(50), nullable=True)
    consultant = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    encounters = relationship("Encounter", back_populates="patient", cascade="all, delete-orphan", order_by="desc(Encounter.created_at)")
    clinical_events = relationship("ClinicalEvent", back_populates="patient", cascade="all, delete-orphan", order_by="ClinicalEvent.created_at")
    documents = relationship("Document", back_populates="patient", cascade="all, delete-orphan", order_by="desc(Document.created_at)")
