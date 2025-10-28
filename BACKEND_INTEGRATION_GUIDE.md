# Backend Integration Guide

## ✅ What Was Changed

All fake/mock data has been **completely removed** from the application. The frontend is now ready to integrate with your backend database.

### Files Modified

1. **src/pages/PatientDashboard.tsx** - Removed all hardcoded patient data
2. **src/pages/DoctorDashboard.tsx** - Removed all hardcoded doctor data

### What Was Removed

#### Patient Dashboard
- ❌ Fake patient name ("John")
- ❌ Hardcoded upcoming appointments
- ❌ Fake vitals data (heart rate, blood pressure, etc.)
- ❌ Mock health records
- ❌ Dummy appointments list
- ❌ Fake consultation history

#### Doctor Dashboard
- ❌ Fake doctor profile ("Dr. Sarah Johnson - Cardiology")
- ❌ Hardcoded statistics (appointments, patients, consultations)
- ❌ Mock upcoming consultations
- ❌ Fake recent patients data
- ❌ Dummy schedule
- ❌ Mock prescriptions
- ❌ Fake messages

---

## 🎨 What Was Added

### Loading States
The app now shows "Loading..." messages while fetching data:
- "Loading appointments..."
- "Loading vitals..."
- "Loading health records..."
- etc.

### Empty States
Beautiful empty state messages when no data exists:
- **No appointments**: Shows calendar icon + "Book your first appointment"
- **No vitals**: Shows activity icon + "Connect your health device"
- **No records**: Shows file icon + "Your medical records will appear here"
- **No patients**: Shows users icon + "Patients you consult will appear here"
- etc.

### State Management
Added React state hooks for all dynamic data:

**Patient Dashboard States:**
```javascript
const [patientName, setPatientName] = useState("");
const [upcomingAppointment, setUpcomingAppointment] = useState(null);
const [vitals, setVitals] = useState([]);
const [recentRecords, setRecentRecords] = useState([]);
const [appointments, setAppointments] = useState([]);
const [healthRecords, setHealthRecords] = useState([]);
const [consultations, setConsultations] = useState([]);
```

**Doctor Dashboard States:**
```javascript
const [doctorProfile, setDoctorProfile] = useState({ name: "", specialty: "" });
const [stats, setStats] = useState([]);
const [upcomingConsultations, setUpcomingConsultations] = useState([]);
const [recentPatients, setRecentPatients] = useState([]);
const [schedule, setSchedule] = useState([]);
const [patients, setPatients] = useState([]);
const [consultations, setConsultations] = useState([]);
const [prescriptions, setPrescriptions] = useState([]);
const [messages, setMessages] = useState([]);
```

---

## 🔌 How to Integrate with Backend

### Step 1: Uncomment API Calls

In both `PatientDashboard.tsx` and `DoctorDashboard.tsx`, you'll find commented API calls in the `useEffect` hook:

```javascript
useEffect(() => {
  const fetchPatientData = async () => {
    try {
      setLoading(true);
      
      // Uncomment and modify these lines with your actual API endpoints:
      // const profileResponse = await fetch('/api/patient/profile');
      // const profileData = await profileResponse.json();
      // setPatientName(profileData.name);
      
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  fetchPatientData();
}, []);
```

### Step 2: Replace with Your API Endpoints

**Example for Patient Profile:**
```javascript
const profileResponse = await fetch('YOUR_API_URL/api/patient/profile', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const profileData = await profileResponse.json();
setPatientName(profileData.name);
```

### Step 3: Follow API Documentation

See `API_DOCUMENTATION.md` for:
- Complete list of all required endpoints
- Expected request/response formats
- Data structures
- Authentication headers
- Error handling

---

## 📊 Data Flow Diagram

```
┌─────────────┐
│   Browser   │
│  (Frontend) │
└──────┬──────┘
       │
       │ 1. Component Mounts
       │ 2. useEffect() runs
       │ 3. setLoading(true)
       │
       ├──────────────────────┐
       │                      │
       ▼                      ▼
┌─────────────┐      ┌─────────────┐
│  API Call   │      │ Loading UI  │
│  (fetch)    │      │   Display   │
└──────┬──────┘      └─────────────┘
       │
       │ 4. Fetch data from backend
       │
       ▼
┌─────────────┐
│   Backend   │
│   Server    │
└──────┬──────┘
       │
       │ 5. Query database
       │
       ▼
┌─────────────┐
│  Database   │
│  (MongoDB/  │
│   MySQL)    │
└──────┬──────┘
       │
       │ 6. Return data
       │
       ▼
┌─────────────┐
│   Backend   │
│  Response   │
└──────┬──────┘
       │
       │ 7. Send JSON response
       │
       ▼
┌─────────────┐
│  Frontend   │
│  setState() │
└──────┬──────┘
       │
       │ 8. setLoading(false)
       │ 9. Update UI with data
       │
       ▼
┌─────────────┐
│  Display    │
│  Real Data  │
└─────────────┘
```

---

## 🔐 Authentication Flow

1. **User Signs In**
   - POST `/api/auth/signin` with email, password, role
   - Backend validates credentials
   - Returns JWT token

2. **Store Token**
   - Save token in `localStorage` or secure cookie
   ```javascript
   localStorage.setItem('authToken', token);
   ```

3. **Include Token in Requests**
   ```javascript
   fetch('/api/patient/profile', {
     headers: {
       'Authorization': `Bearer ${localStorage.getItem('authToken')}`
     }
   });
   ```

4. **Handle Token Expiry**
   - Check for 401 responses
   - Redirect to sign-in page if unauthorized

---

## 🗄️ Database Schema Examples

### Patient Table
```sql
CREATE TABLE patients (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  age INT,
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP
);
```

### Doctor Table
```sql
CREATE TABLE doctors (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  specialty VARCHAR(100),
  license VARCHAR(50),
  hospital VARCHAR(200),
  created_at TIMESTAMP
);
```

### Appointments Table
```sql
CREATE TABLE appointments (
  id VARCHAR(50) PRIMARY KEY,
  patient_id VARCHAR(50),
  doctor_id VARCHAR(50),
  date DATE,
  time TIME,
  type VARCHAR(50),
  status VARCHAR(20),
  meeting_link TEXT,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);
```

### Vitals Table
```sql
CREATE TABLE vitals (
  id VARCHAR(50) PRIMARY KEY,
  patient_id VARCHAR(50),
  label VARCHAR(50),
  value VARCHAR(50),
  status VARCHAR(20),
  timestamp TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);
```

### Health Records Table
```sql
CREATE TABLE health_records (
  id VARCHAR(50) PRIMARY KEY,
  patient_id VARCHAR(50),
  type VARCHAR(50),
  title VARCHAR(200),
  doctor VARCHAR(100),
  date DATE,
  file_url TEXT,
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);
```

---

## 🚀 Quick Start Guide

### 1. Set Up Backend
```bash
# Example with Node.js/Express
npm install express mongoose jsonwebtoken bcrypt cors
```

### 2. Create Database
- Set up MongoDB, PostgreSQL, or MySQL
- Create tables/collections using schemas above

### 3. Implement API Endpoints
- Refer to `API_DOCUMENTATION.md`
- Start with authentication endpoints
- Then implement patient/doctor endpoints

### 4. Test Endpoints
```bash
# Use tools like Postman or curl
curl -X GET http://localhost:3000/api/patient/profile \
  -H "Authorization: Bearer your_token_here"
```

### 5. Connect Frontend
- Uncomment API calls in dashboard files
- Replace with your actual API URLs
- Test each feature end-to-end

### 6. Handle CORS
```javascript
// Backend (Express example)
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:8080' // Your frontend URL
}));
```

---

## ✨ Features Ready for Integration

### Patient Side
- ✅ Dashboard with personalized welcome
- ✅ Real-time vitals display
- ✅ Appointment management
- ✅ Health records viewing
- ✅ Consultation history
- ✅ Profile management
- ✅ AI Assistant chat (ready for integration)

### Doctor Side
- ✅ Dashboard with statistics
- ✅ Today's schedule/consultations
- ✅ Patient database
- ✅ Appointment management
- ✅ Prescription writing
- ✅ Patient messaging
- ✅ Profile settings

---

## 🎯 Testing Checklist

- [ ] Patient sign up with form data
- [ ] Doctor sign up with credentials
- [ ] Sign in for both roles
- [ ] Patient dashboard loads with real data
- [ ] Doctor dashboard shows statistics
- [ ] Appointments display correctly
- [ ] Vitals update from wearables/input
- [ ] Health records upload and display
- [ ] Prescriptions can be written and viewed
- [ ] Messages between patient and doctor
- [ ] Profile updates save to database

---

## 📝 Important Notes

1. **No Fake Data**: The frontend has ZERO hardcoded data. Everything comes from your backend.

2. **Layout Preserved**: All UI/UX design remains exactly the same. Only data source changed.

3. **Empty States**: Users see helpful messages when no data exists (not errors).

4. **Loading States**: Users see loading indicators while data fetches (not blank screens).

5. **Error Handling**: Add try-catch blocks and show user-friendly error messages.

6. **Security**: Always validate and sanitize data on backend. Never trust client input.

---

## 🆘 Troubleshooting

### Issue: "Loading..." never stops
**Solution**: Check browser console for network errors. Verify API endpoint URLs and CORS settings.

### Issue: Empty states showing even with data
**Solution**: Check that data format from backend matches expected structure in frontend.

### Issue: 401 Unauthorized
**Solution**: Verify JWT token is being sent correctly in Authorization header.

### Issue: Data not updating
**Solution**: Check that setState functions are being called after successful API responses.

---

## 📚 Additional Resources

- `API_DOCUMENTATION.md` - Complete API specification
- `README.md` - Project setup and running instructions
- React Documentation - https://react.dev
- JWT Authentication - https://jwt.io

---

## 🎉 You're Ready!

The frontend is now a clean slate waiting for your backend data. Follow the steps above to connect everything together. Good luck! 🚀
