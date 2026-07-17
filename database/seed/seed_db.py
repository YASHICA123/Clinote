import os
import sys

# Add root folder to sys.path so backend packages resolve
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from backend.database.supabase import supabase, is_supabase_configured
from backend.repositories.mock_store import mock_db

def seed_database():
    if not is_supabase_configured:
        print("Error: Supabase is not configured. Please check backend/.env file.")
        return

    print("Starting database seeding...")

    # 1. Seed Patients (patient_master)
    print("Seeding patient_master table...")
    for patient_id, data in mock_db.patients.items():
        try:
            # Map parameters to DB schema (optional mapping or insert directly)
            res = supabase.table("patient_master").upsert(data).execute()
            print(f"Upserted patient: {data.get('name')} (ID: {patient_id})")
        except Exception as e:
            print(f"Failed to seed patient {patient_id}: {e}")

    # 2. Seed Timeline Events (timeline_events)
    print("Seeding timeline_events table...")
    for patient_id, events in mock_db.timeline.items():
        for event in events:
            try:
                res = supabase.table("timeline_events").upsert(event).execute()
                print(f"Upserted timeline event: {event.get('title')} for Patient ID: {patient_id}")
            except Exception as e:
                print(f"Failed to seed timeline event {event.get('id')}: {e}")

    # 3. Seed Medications (medications)
    print("Seeding medications table...")
    for patient_id, meds in mock_db.medications.items():
        for med in meds:
            try:
                res = supabase.table("medications").upsert(med).execute()
                print(f"Upserted medication: {med.get('name')} for Patient ID: {patient_id}")
            except Exception as e:
                print(f"Failed to seed medication {med.get('id')}: {e}")

    # 4. Seed Investigations (investigations)
    print("Seeding investigations table...")
    for patient_id, invs in mock_db.investigations.items():
        for inv in invs:
            try:
                res = supabase.table("investigations").upsert(inv).execute()
                print(f"Upserted investigation: {inv.get('testName')} for Patient ID: {patient_id}")
            except Exception as e:
                print(f"Failed to seed investigation {inv.get('id')}: {e}")

    # 5. Seed Reports (reports)
    print("Seeding reports table...")
    for patient_id, reps in mock_db.reports.items():
        for rep in reps:
            try:
                res = supabase.table("reports").upsert(rep).execute()
                print(f"Upserted report: {rep.get('title')} for Patient ID: {patient_id}")
            except Exception as e:
                print(f"Failed to seed report {rep.get('id')}: {e}")

    print("Database seeding completed!")

if __name__ == "__main__":
    seed_database()
