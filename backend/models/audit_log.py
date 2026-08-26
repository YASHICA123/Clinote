import uuid
from datetime import datetime
from sqlalchemy import Column, String, Text, DateTime
from backend.database.session import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(255), nullable=True)
    user_email = Column(String(255), nullable=True)
    action = Column(String(100), nullable=False, index=True)
    resource_type = Column(String(100), nullable=False)
    resource_id = Column(String(255), nullable=False)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
