# Clinote MVP – Phase 1: Foundation

## Goal

Build the basic Clinote platform before adding AI. By the end of Phase 1, a clinician should be able to:

- Log in
- Create and search for patients
- Open a patient profile
- Create an encounter
- Enter clinical notes manually
- View a chronological patient timeline
- Save and retrieve clinical documents/events

Phase 1 intentionally includes **no LLMs, RAG, agents, or voice processing**.

---

## 1. Phase 1 System Flow

```text
Doctor
   |
   v
Login
   |
   v
Dashboard
   |
   v
Search / Create Patient
   |
   v
Open Patient Profile
   |
   +-------------------+
   |                   |
   v                   v
Create Encounter    View History
   |
   v
Enter Clinical Note
   |
   v
PostgreSQL
   |
   v
Patient Timeline
```

---

## 2. MVP Architecture

Keep Phase 1 as a modular monolith.

```text
Frontend: React / Next.js
          |
          v
Backend: FastAPI
          |
          +---------------------------+
          |           |               |
          v           v               v
        Auth       Patient         Clinical
        Module     Module          Module
          |           |               |
          +-----------+---------------+
                      |
                      v
                 PostgreSQL
```

Recommended stack:

| Layer | Technology |
|---|---|
| Frontend | React or Next.js |
| Backend | FastAPI + Python |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Validation | Pydantic |
| Authentication | JWT |
| API documentation | OpenAPI / Swagger |
| Deployment | Docker |

---

## 3. Backend Project Structure

```text
clinote-backend/
|
├── main.py
|
├── app/
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   └── database.py
│   │
│   ├── models/
│   │   ├── user.py
│   │   ├── patient.py
│   │   ├── encounter.py
│   │   ├── clinical_event.py
│   │   ├── document.py
│   │   └── audit_log.py
│   │
│   ├── schemas/
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── patient.py
│   │   ├── encounter.py
│   │   ├── clinical_event.py
│   │   └── document.py
│   │
│   ├── routers/
│   │   ├── auth.py
│   │   ├── patients.py
│   │   ├── encounters.py
│   │   ├── clinical.py
│   │   └── documents.py
│   │
│   └── services/
│       ├── patient_service.py
│       ├── encounter_service.py
│       └── timeline_service.py
│
└── requirements.txt
```

Start as one deployable backend. Do not introduce microservices in Phase 1.

---

## 4. Core Data Model

### 4.1 Users

Purpose: authentication and access control.

```text
users
```

Suggested fields:

```text
id
name
email
password_hash
role
is_active
created_at
updated_at
```

Initial roles:

```text
ADMIN
DOCTOR
```

Additional roles can be added later.

---

### 4.2 Patients

Purpose: store basic patient identity and hospital identifiers.

```text
patients
```

Suggested fields:

```text
id
hospital_patient_id
name
date_of_birth
gender
created_at
updated_at
```

Keep the MVP patient model minimal. Add hospital-specific fields only when needed.

---

### 4.3 Encounters

An encounter represents a patient visit or admission.

```text
Patient
   |
   +-- Encounter 1
   |
   +-- Encounter 2
   |
   +-- Encounter 3
```

Suggested fields:

```text
id
patient_id
doctor_id
department
admission_date
discharge_date
status
created_at
updated_at
```

Possible status values:

```text
ACTIVE
DISCHARGED
CLOSED
```

---

### 4.4 Clinical Events

This is the most important Phase 1 model because it becomes the basis of the patient timeline.

```text
clinical_events
```

Suggested fields:

```text
id
patient_id
encounter_id
event_type
content
created_by
created_at
updated_at
```

Initial event types:

```text
INITIAL_ASSESSMENT
DAILY_UPDATE
INVESTIGATION
MEDICATION_UPDATE
PROCEDURE
DISCHARGE
```

Example timeline:

```text
15 Aug  Initial Assessment
16 Aug  Daily Update
17 Aug  Investigation
18 Aug  Medication Update
19 Aug  Daily Update
20 Aug  Discharge
```

---

### 4.5 Documents

For Phase 1, this can store clinician-created documents separately from individual events.

Suggested fields:

```text
id
patient_id
encounter_id
document_type
title
content
status
created_by
created_at
updated_at
```

Possible status:

```text
DRAFT
FINAL
```

---

### 4.6 Audit Logs

Record important actions.

Suggested fields:

```text
id
user_id
action
resource_type
resource_id
created_at
```

Examples:

```text
PATIENT_CREATED
PATIENT_VIEWED
ENCOUNTER_CREATED
CLINICAL_EVENT_CREATED
DOCUMENT_UPDATED
DOCUMENT_FINALIZED
```

For an MVP, focus on meaningful write actions first. Expand read-access auditing according to deployment and compliance requirements.

---

## 5. Phase 1 APIs

### 5.1 Authentication

```http
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
```

Login flow:

```text
Doctor Email + Password
          |
          v
Password Verification
          |
          v
JWT Generated
          |
          v
Authenticated API Requests
```

Example login request:

```json
{
  "email": "doctor@example.com",
  "password": "********"
}
```

Example response:

```json
{
  "access_token": "<jwt>",
  "token_type": "bearer"
}
```

---

### 5.2 Patient APIs

```http
POST  /api/v1/patients
GET   /api/v1/patients
GET   /api/v1/patients/{patient_id}
PATCH /api/v1/patients/{patient_id}
```

Create patient:

```json
{
  "name": "John Doe",
  "hospital_patient_id": "MRN-1001",
  "date_of_birth": "1980-05-15",
  "gender": "male"
}
```

Suggested patient list query parameters:

```text
GET /api/v1/patients?search=John
GET /api/v1/patients?hospital_patient_id=MRN-1001
```

---

### 5.3 Encounter APIs

```http
POST  /api/v1/patients/{patient_id}/encounters
GET   /api/v1/encounters/{encounter_id}
PATCH /api/v1/encounters/{encounter_id}
```

Create encounter:

```json
{
  "department": "General Medicine",
  "admission_date": "2026-08-23"
}
```

---

### 5.4 Clinical Event APIs

```http
POST /api/v1/clinical/events
GET  /api/v1/clinical/events/{event_id}
PATCH /api/v1/clinical/events/{event_id}
```

Create event:

```json
{
  "patient_id": "P1001",
  "encounter_id": "E1001",
  "event_type": "DAILY_UPDATE",
  "content": "Patient is stable today. Fever has reduced."
}
```

---

### 5.5 Patient Timeline API

```http
GET /api/v1/patients/{patient_id}/timeline
```

Optional query parameters:

```text
?encounter_id=E1001
?from_date=2026-08-15
?to_date=2026-08-23
```

Example response:

```json
{
  "patient_id": "P1001",
  "events": [
    {
      "event_id": "EV1001",
      "event_type": "INITIAL_ASSESSMENT",
      "content": "Patient presented with...",
      "created_at": "2026-08-15T10:30:00Z"
    },
    {
      "event_id": "EV1002",
      "event_type": "DAILY_UPDATE",
      "content": "Patient is stable today...",
      "created_at": "2026-08-16T09:00:00Z"
    }
  ]
}
```

---

### 5.6 Document APIs

```http
POST  /api/v1/documents
GET   /api/v1/documents/{document_id}
PATCH /api/v1/documents/{document_id}
POST  /api/v1/documents/{document_id}/finalize
```

Document lifecycle:

```text
DRAFT
  |
  v
Doctor edits
  |
  v
FINAL
```

Do not allow finalized records to be silently overwritten. Future phases should use document versioning.

---

## 6. Frontend Screens

### Screen 1: Login

```text
+----------------------------------+
|             CLINOTE              |
|                                  |
| Email                            |
| [____________________________]   |
|                                  |
| Password                         |
| [____________________________]   |
|                                  |
|          [ Login ]               |
+----------------------------------+
```

### Screen 2: Dashboard

```text
+----------------------------------+
| Clinote             Doctor Name  |
+----------------------------------+
|                                  |
| [ Search Patient ]               |
|                                  |
| [ + Create Patient ]             |
|                                  |
| Recent Patients                  |
| - Patient A                      |
| - Patient B                      |
| - Patient C                      |
+----------------------------------+
```

### Screen 3: Patient Profile

```text
PATIENT: John Doe
MRN: MRN-1001

[ Overview ] [ Timeline ] [ Documents ]

+ New Encounter
+ New Clinical Event
```

### Screen 4: New Clinical Event

```text
Patient: John Doe
Encounter: E1001

Event Type:
[ Daily Update v ]

Clinical Note:
+----------------------------------+
|                                  |
|                                  |
|                                  |
+----------------------------------+

[ Save Draft ] [ Save Event ]
```

### Screen 5: Patient Timeline

```text
PATIENT: John Doe

15 Aug 2026
INITIAL ASSESSMENT
Patient presented with...

16 Aug 2026
DAILY UPDATE
Patient is stable...

17 Aug 2026
INVESTIGATION
Blood test results...
```

---

## 7. Timeline Service

The timeline should be generated from the source-of-truth clinical events.

```text
Clinical Events
      |
      v
Filter by Patient
      |
      v
Optional Encounter Filter
      |
      v
Sort by created_at
      |
      v
Return Chronological Timeline
```

Do not create a separate timeline database table initially unless performance or product requirements later justify it.

---

## 8. Security Basics

Implement from the beginning:

- Password hashing; never store plaintext passwords
- JWT authentication
- Role checks
- HTTPS in deployed environments
- Input validation with Pydantic
- Database parameterization/ORM protections
- Secrets stored outside source control
- Basic audit logging
- Backups and restricted database access

For real patient data, perform a proper security and regulatory review before production deployment.

---

## 9. Phase 1 Acceptance Criteria

Phase 1 is complete when:

- [ ] A user can register or be provisioned
- [ ] A user can log in successfully
- [ ] Protected endpoints reject unauthenticated requests
- [ ] A user can create a patient
- [ ] A user can search/list patients
- [ ] A user can open a patient profile
- [ ] A user can create an encounter
- [ ] A user can create a clinical event
- [ ] A clinical event is linked to the correct patient and encounter
- [ ] Events appear in chronological order in the patient timeline
- [ ] A user can create and edit draft documents
- [ ] Finalized documents follow a controlled lifecycle
- [ ] Important write actions are logged
- [ ] API documentation is available through OpenAPI/Swagger
- [ ] The system runs locally with Docker

---

## 10. Recommended Build Order

### Step 1
Project setup:

```text
FastAPI
PostgreSQL
SQLAlchemy
Alembic migrations
Docker
Environment configuration
```

### Step 2
Authentication:

```text
User model
Password hashing
JWT
Protected routes
```

### Step 3
Patients:

```text
Patient model
Create patient
Get patient
List/search patients
Update patient
```

### Step 4
Encounters:

```text
Encounter model
Create encounter
Get encounter
Update encounter status
```

### Step 5
Clinical Events:

```text
Clinical event model
Create event
Get event
Edit event
```

### Step 6
Timeline:

```text
Get all patient events
Filter by encounter
Sort chronologically
Return timeline
```

### Step 7
Documents and audit:

```text
Draft document
Edit document
Finalize document
Audit important actions
```

### Step 8
Frontend integration:

```text
Login
Dashboard
Patient search
Patient profile
Encounter creation
Clinical event entry
Timeline
```

---

## 11. Phase 1 Completion Architecture

```text
                    CLINOTE MVP

                       Doctor
                          |
                          v
                    React / Next.js
                          |
                          v
                       FastAPI
                          |
          +---------------+---------------+
          |               |               |
          v               v               v
        Auth          Patients         Clinical
          |               |               |
          +---------------+---------------+
                          |
                          v
                     PostgreSQL
                          |
             +------------+------------+
             |            |            |
             v            v            v
          Users        Patients      Encounters
                                      |
                                      v
                               Clinical Events
                                      |
                                      v
                              Patient Timeline
```

## Key Principle

Phase 1 creates the data foundation for later phases.

The architecture should first make this reliable:

```text
Patient
  ->
Encounter
  ->
Clinical Event
  ->
Chronological Timeline
```

Only after this foundation is working should the next phase add LLM-powered structured extraction.
