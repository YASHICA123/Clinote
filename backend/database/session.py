import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from backend.config.settings import settings

database_url = settings.DATABASE_URL
connect_args = {}

if database_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(
    database_url,
    connect_args=connect_args,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    from backend.models import user, patient, encounter, clinical_event, document, audit_log
    Base.metadata.create_all(bind=engine)
    
    # Run initial seed if empty
    from backend.database.seed import seed_database
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
