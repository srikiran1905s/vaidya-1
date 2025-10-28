# Vaidya API Documentation

This document outlines all the API endpoints needed for the Vaidya telemedicine platform. All fake data has been removed from the frontend, and the application is now ready to connect to your backend.

## Authentication

All API requests should include authentication headers:
```
Authorization: Bearer {token}
```

## Base URL
```
/api
```

---

## Patient Endpoints

### 1. Get Patient Profile
```
GET /api/patient/profile
```
**Response:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "age": 35,
  "phone": "+1234567890",
  "address": "123 Main St"
}
```

### 2. Get Patient Vitals (Latest)
```
GET /api/patient/vitals/latest
```
**Response:**
```json
[
  {
    "label": "Heart Rate",
    "value": "72 bpm",
    "status": "normal",
    "timestamp": "2025-01-24T10:30:00Z"
  },
  {
    "label": "Blood Pressure",
    "value": "120/80",
    "status": "normal",
    "timestamp": "2025-01-24T10:30:00Z"
  },
  {
    "label": "Temperature",
    "value": "98.6°F",
    "status": "normal",
    "timestamp": "2025-01-24T10:30:00Z"
  },
  {
    "label": "Oxygen",
    "value": "98%",
    "status": "normal",
    "timestamp": "2025-01-24T10:30:00Z"
  }
]
```

### 3. Get Upcoming Appointment
```
GET /api/patient/appointments/upcoming
```
**Response:**
```json
{
  "id": "apt_123",
  "doctor": "Dr. Sarah Johnson",
  "specialty": "General Physician",
  "date": "Today, 3:00 PM",
  "type": "Video Consultation",
  "meetingLink": "https://..."
}
```
**Empty Response:** `null` (if no upcoming appointments)

### 4. Get All Patient Appointments
```
GET /api/patient/appointments
```
**Response:**
```json
[
  {
    "id": "apt_123",
    "doctorName": "Dr. Sarah Johnson",
    "specialty": "General Physician",
    "date": "2025-01-25",
    "time": "3:00 PM",
    "status": "scheduled",
    "type": "Video Consultation"
  }
]
```

### 5. Get Recent Health Records
```
GET /api/patient/records/recent
```
**Response:**
```json
[
  {
    "id": "rec_123",
    "type": "Lab Results",
    "doctor": "Dr. Chen",
    "date": "Jan 15, 2025",
    "fileUrl": "https://..."
  },
  {
    "id": "rec_124",
    "type": "Prescription",
    "doctor": "Dr. Johnson",
    "date": "Jan 10, 2025",
    "fileUrl": "https://..."
  }
]
```

### 6. Get All Health Records
```
GET /api/patient/records
```
**Response:**
```json
[
  {
    "id": "rec_123",
    "title": "Blood Test Results",
    "type": "Lab Results",
    "date": "2025-01-15",
    "doctor": "Dr. Chen",
    "fileUrl": "https://..."
  }
]
```

### 7. Get Consultation History
```
GET /api/patient/consultations
```
**Response:**
```json
[
  {
    "id": "con_123",
    "doctorName": "Dr. Sarah Johnson",
    "specialty": "General Physician",
    "date": "2025-01-20",
    "time": "2:00 PM",
    "status": "completed",
    "duration": "30 mins",
    "notes": "Follow-up in 2 weeks"
  }
]
```

---

## Doctor Endpoints

### 1. Get Doctor Profile
```
GET /api/doctor/profile
```
**Response:**
```json
{
  "name": "Dr. Sarah Johnson",
  "specialty": "Cardiology",
  "email": "sarah.johnson@hospital.com",
  "phone": "+1234567890",
  "license": "MD123456",
  "hospital": "City General Hospital"
}
```

### 2. Get Doctor Statistics
```
GET /api/doctor/stats
```
**Response:**
```json
[
  {
    "label": "Today's Appointments",
    "value": "8",
    "icon": "Calendar",
    "color": "text-primary"
  },
  {
    "label": "Waiting Patients",
    "value": "3",
    "icon": "Clock",
    "color": "text-warning"
  },
  {
    "label": "Total Patients",
    "value": "156",
    "icon": "Users",
    "color": "text-secondary"
  },
  {
    "label": "Consultations",
    "value": "24",
    "icon": "Video",
    "color": "text-success"
  }
]
```

### 3. Get Upcoming Consultations (Today's Schedule)
```
GET /api/doctor/consultations/upcoming
```
**Response:**
```json
[
  {
    "id": "con_123",
    "patient": "John Smith",
    "patientId": "pat_456",
    "time": "2:00 PM",
    "type": "Follow-up",
    "priority": "normal",
    "duration": "30 mins"
  },
  {
    "id": "con_124",
    "patient": "Emma Wilson",
    "patientId": "pat_457",
    "time": "2:30 PM",
    "type": "Initial",
    "priority": "high",
    "duration": "45 mins"
  }
]
```

### 4. Get Recent Patients
```
GET /api/doctor/patients/recent
```
**Response:**
```json
[
  {
    "id": "pat_123",
    "name": "Sarah Johnson",
    "lastVisit": "Jan 15, 2025",
    "condition": "Hypertension",
    "age": 45,
    "phone": "+1234567890"
  }
]
```

### 5. Get All Doctor's Schedule
```
GET /api/doctor/schedule
```
**Response:**
```json
[
  {
    "id": "apt_123",
    "patientName": "John Smith",
    "patientId": "pat_456",
    "date": "2025-01-25",
    "time": "3:00 PM",
    "type": "Video Consultation",
    "status": "scheduled"
  }
]
```

### 6. Get All Patients
```
GET /api/doctor/patients
```
**Response:**
```json
[
  {
    "id": "pat_123",
    "name": "Sarah Johnson",
    "age": 45,
    "condition": "Hypertension",
    "phone": "+1234567890",
    "email": "sarah@example.com",
    "lastVisit": "2025-01-15"
  }
]
```

### 7. Get Consultation History
```
GET /api/doctor/consultations
```
**Response:**
```json
[
  {
    "id": "con_123",
    "patientName": "John Smith",
    "patientId": "pat_456",
    "date": "2025-01-20",
    "time": "2:00 PM",
    "status": "completed",
    "duration": "30 mins",
    "notes": "Patient improving"
  }
]
```

### 8. Get All Prescriptions
```
GET /api/doctor/prescriptions
```
**Response:**
```json
[
  {
    "id": "presc_123",
    "patientName": "John Smith",
    "patientId": "pat_456",
    "medication": "Aspirin 75mg",
    "dosage": "Once daily",
    "date": "2025-01-20",
    "duration": "30 days"
  }
]
```

### 9. Get Messages
```
GET /api/doctor/messages
```
**Response:**
```json
[
  {
    "id": "msg_123",
    "from": "John Smith",
    "patientId": "pat_456",
    "preview": "Question about medication...",
    "timestamp": "2025-01-24T10:30:00Z",
    "unread": true
  }
]
```

---

## Common Endpoints

### 1. Sign Up
```
POST /api/auth/signup
```
**Request Body:**
```json
{
  "role": "patient", // or "doctor"
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "age": 35, // for patients
  "specialization": "Cardiology", // for doctors
  "license": "MD123456", // for doctors
  "hospital": "City General" // for doctors
}
```
**Response:**
```json
{
  "message": "Account created successfully",
  "userId": "user_123"
}
```

### 2. Sign In
```
POST /api/auth/signin
```
**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword",
  "role": "patient" // or "doctor"
}
```
**Response:**
```json
{
  "token": "jwt_token_here",
  "userId": "user_123",
  "role": "patient",
  "name": "John Doe"
}
```

---

## Data Flow

### Frontend State Management
The frontend uses React `useState` and `useEffect` hooks to:
1. Fetch data when component mounts
2. Display loading states while fetching
3. Show empty states when no data exists
4. Display actual data when available

### Example Implementation in Frontend
```javascript
useEffect(() => {
  const fetchPatientData = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/patient/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setPatientName(data.name);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  fetchPatientData();
}, []);
```

## Error Handling

All endpoints should return proper HTTP status codes:
- **200**: Success
- **201**: Created (for POST requests)
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (auth token missing/invalid)
- **404**: Not Found
- **500**: Internal Server Error

**Error Response Format:**
```json
{
  "error": "Error message here",
  "code": "ERROR_CODE"
}
```

## Notes

1. **All fake data removed**: The frontend no longer contains any hardcoded patient/doctor data
2. **Loading states**: UI shows "Loading..." while fetching data
3. **Empty states**: UI shows friendly messages when no data exists
4. **Data validation**: Frontend expects data in the formats specified above
5. **Authentication**: All requests should be authenticated with JWT tokens
6. **Real-time updates**: Consider using WebSockets for real-time features like chat and live consultations

## Next Steps

1. Implement these API endpoints in your backend
2. Set up database schema to store this data
3. Implement authentication and authorization
4. Test each endpoint with the frontend
5. Add real-time features (WebSockets) for consultations and chat
6. Implement file upload for health records and prescriptions
