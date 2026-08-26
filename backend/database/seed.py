from passlib.context import CryptContext
from sqlalchemy.orm import Session
from backend.models import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def seed_database(db: Session):
    # Check if user accounts already exist
    if db.query(User).first():
        return

    print("Initializing system clinician user accounts...")

    # Seed User Accounts for Authentication (Zero fake patients)
    admin_user = User(
        name="System Admin",
        email="admin@clinote.ai",
        password_hash=get_password_hash("admin123"),
        role="ADMIN",
        specialty="Administration",
        is_active=True
    )
    dr_bhasin = User(
        name="Dr. Deepak Bhasin",
        email="dr.bhasin@clinote.ai",
        password_hash=get_password_hash("doctor123"),
        role="DOCTOR",
        specialty="Chief Consultant - Pulmonology",
        is_active=True
    )
    dr_deepak_alt = User(
        name="Dr. Deepak Bhasin",
        email="deepak.bhasin@clinote.com",
        password_hash=get_password_hash("password123"),
        role="DOCTOR",
        specialty="Chief Consultant",
        is_active=True
    )
    dr_sarah = User(
        name="Dr. Sarah Paul",
        email="doctor@clinote.ai",
        password_hash=get_password_hash("doctor123"),
        role="DOCTOR",
        specialty="Internal Medicine",
        is_active=True
    )
    nurse_emily = User(
        name="Nurse Emily",
        email="nurse@clinote.ai",
        password_hash=get_password_hash("nurse123"),
        role="NURSE",
        specialty="ICU Staff Nurse",
        is_active=True
    )

    db.add_all([admin_user, dr_bhasin, dr_deepak_alt, dr_sarah, nurse_emily])
    db.commit()
    print("Clinician accounts initialized successfully. Zero fake patient records.")
