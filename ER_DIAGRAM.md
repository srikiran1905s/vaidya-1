# Vaidya Telemedicine Platform - ER Diagram

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         VAIDYA TELEMEDICINE SYSTEM                          │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────┐
│      PATIENTS        │
├──────────────────────┤
│ PK: _id              │
│     name             │
│     email (unique)   │
│     password         │
│     age              │
│     phone            │
│     bloodGroup       │
│     height           │
│     weight           │
│     allergies        │
│     conditions       │
└──────────────────────┘
         │
         │ 1
         │
         │ books
         │
         │ N
         ▼
┌──────────────────────┐         ┌──────────────────────┐
│    APPOINTMENTS      │────────▶│      DOCTORS         │
├──────────────────────┤  N : 1  ├──────────────────────┤
│ PK: id               │ manages │ PK: _id              │
│ FK: patientId        │         │     name             │
│ FK: doctorId         │         │     email (unique)   │
│     patientName      │         │     password         │
│     doctorName       │         │     specialty        │
│     specialty        │         │     license          │
│     date             │         └──────────────────────┘
│     time             │                  │
│     type             │                  │ 1
│     status           │                  │
│     priority         │                  │ creates
│     healthIssue      │                  │
│     symptoms[]       │                  │ N
│     notes            │                  ▼
│     meetingLink      │         ┌──────────────────────┐
│     duration         │         │   PRESCRIPTIONS      │
└──────────────────────┘         ├──────────────────────┤
         │                       │ PK: id               │
         │ 1                     │ FK: patientId        │
         │                       │ FK: doctorId         │
         │ generates             │     patientName      │
         │                       │     diagnosis        │
         │ 1                     │     medications[]    │
         ▼                       │       - name         │
┌──────────────────────┐         │       - dosage       │
│   HEALTH_RECORDS     │         │       - frequency    │
├──────────────────────┤         │       - duration     │
│ PK: id               │         │       - instructions │
│ FK: patientId        │         │     notes            │
│ FK: doctorId         │         │     date             │
│     title            │         │     validUntil       │
│     type             │         │     status           │
│     doctor           │         └──────────────────────┘
│     date             │                  │
│     description      │                  │ 1
│     fileUrl          │                  │
└──────────────────────┘                  │ for
         ▲                                │
         │ 1                              │ N
         │                                ▼
         │ tracks                ┌──────────────────────┐
         │                       │      PATIENTS        │
         │ N                     │   (receives Rx)      │
         │                       └──────────────────────┘
┌──────────────────────┐
│       VITALS         │
├──────────────────────┤
│ PK: id               │
│ FK: patientId        │
│     label            │
│     value            │
│     status           │
│     unit             │
│     createdAt        │
└──────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
                              RELATIONSHIPS
═══════════════════════════════════════════════════════════════════════════════

1. PATIENTS ──(1:N)── APPOINTMENTS
   - One patient can book multiple appointments
   - Each appointment belongs to one patient

2. DOCTORS ──(1:N)── APPOINTMENTS
   - One doctor can have multiple appointments
   - Each appointment is with one doctor

3. PATIENTS ──(1:N)── VITALS
   - One patient can have multiple vital records
   - Each vital record belongs to one patient

4. PATIENTS ──(1:N)── HEALTH_RECORDS
   - One patient can have multiple health records
   - Each health record belongs to one patient

5. DOCTORS ──(1:N)── HEALTH_RECORDS
   - One doctor can create multiple health records
   - Each health record is created by one doctor

6. DOCTORS ──(1:N)── PRESCRIPTIONS
   - One doctor can create multiple prescriptions
   - Each prescription is created by one doctor

7. PATIENTS ──(1:N)── PRESCRIPTIONS
   - One patient can receive multiple prescriptions
   - Each prescription is for one patient


═══════════════════════════════════════════════════════════════════════════════
                            ENTITY ATTRIBUTES
═══════════════════════════════════════════════════════════════════════════════

PATIENTS
--------
- _id: Primary Key (String/ObjectId)
- name: String (required)
- email: String (unique, required)
- password: String (hashed, required)
- age: Integer
- phone: String
- bloodGroup: String (A+, A-, B+, B-, O+, O-, AB+, AB-)
- height: Integer (cm)
- weight: Integer (kg)
- allergies: String
- conditions: String (chronic conditions)

DOCTORS
-------
- _id: Primary Key (String/ObjectId)
- name: String (required)
- email: String (unique, required)
- password: String (hashed, required)
- specialty: String (e.g., Cardiology, General Physician)
- license: String

APPOINTMENTS
------------
- id: Primary Key (String)
- patientId: Foreign Key → PATIENTS._id
- doctorId: Foreign Key → DOCTORS._id
- patientName: String
- doctorName: String
- specialty: String
- date: DateTime (ISO format)
- time: String (e.g., "3:00 PM")
- type: String (Video Consultation, Initial, Follow-up, Emergency, Blocked)
- status: String (scheduled, completed, cancelled, blocked)
- priority: String (normal, high)
- healthIssue: String
- symptoms: Array of Strings
- notes: String
- meetingLink: String (URL)
- duration: Integer (minutes)

VITALS
------
- id: Primary Key (String)
- patientId: Foreign Key → PATIENTS._id
- label: String (Heart Rate, Blood Pressure, Temperature, Oxygen)
- value: String (e.g., "72 bpm", "120/80")
- status: String (normal, warning, critical)
- unit: String (bpm, mmHg, °F, %)
- createdAt: DateTime (ISO format)

HEALTH_RECORDS
--------------
- id: Primary Key (String)
- patientId: Foreign Key → PATIENTS._id
- doctorId: Foreign Key → DOCTORS._id
- title: String
- type: String (Lab Results, Prescription, X-Ray, Report)
- doctor: String (doctor name)
- date: Date (YYYY-MM-DD)
- description: String
- fileUrl: String (URL to document)

PRESCRIPTIONS
-------------
- id: Primary Key (String)
- patientId: Foreign Key → PATIENTS._id
- doctorId: Foreign Key → DOCTORS._id
- patientName: String
- diagnosis: String
- medications: Array of Objects
  - name: String (medicine name)
  - dosage: String (e.g., "10mg", "500mg")
  - frequency: String (Once daily, Twice daily, etc.)
  - duration: String (e.g., "30 days", "90 days")
  - instructions: String (optional)
- notes: String
- date: Date (YYYY-MM-DD)
- validUntil: Date (YYYY-MM-DD)
- status: String (active, expired)


═══════════════════════════════════════════════════════════════════════════════
                          BUSINESS RULES
═══════════════════════════════════════════════════════════════════════════════

1. Authentication:
   - Patients and Doctors have separate authentication
   - JWT tokens used for session management
   - Passwords are hashed using bcrypt

2. Appointments:
   - Status can be: scheduled, completed, cancelled, blocked
   - Blocked appointments are used by doctors to mark unavailable time slots
   - Only scheduled appointments appear in doctor's today's schedule
   - Past appointments are automatically hidden from upcoming view
   - Patients can cancel their own appointments
   - Doctors can cancel, reschedule, or mark appointments as completed

3. Prescriptions:
   - Only doctors can create prescriptions
   - Prescriptions are linked to both patient and doctor
   - Multiple medications can be added to one prescription
   - Status changes from active to expired based on validUntil date

4. Health Records:
   - Created by doctors for patients
   - Can include various types: Lab Results, Prescriptions, X-Rays, Reports
   - Stored with file URLs for document access

5. Vitals:
   - Tracked per patient
   - Latest 4 vitals displayed on patient dashboard
   - Status indicates normal, warning, or critical levels

6. Availability:
   - Doctor availability calculated from scheduled appointments
   - Weekly calendar shows 7 days with 8 time slots per day
   - Time slots: 9 AM, 10 AM, 11 AM, 12 PM, 2 PM, 3 PM, 4 PM, 5 PM
   - Lunch break: 12 PM - 2 PM


═══════════════════════════════════════════════════════════════════════════════
                          DATABASE INDEXES
═══════════════════════════════════════════════════════════════════════════════

Recommended indexes for performance:

PATIENTS:
- email (unique)

DOCTORS:
- email (unique)

APPOINTMENTS:
- patientId
- doctorId
- status
- date
- compound: (doctorId, status, date)

VITALS:
- patientId
- createdAt

HEALTH_RECORDS:
- patientId
- doctorId
- date

PRESCRIPTIONS:
- patientId
- doctorId
- date
- status
