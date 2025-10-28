# Vaidya Backend API

Backend server for the Vaidya Telemedicine Platform built with Node.js, Express, and MongoDB.

## ✅ Status

```
✅ MongoDB Connected Successfully!
📊 Database: vaidya
🚀 Server running on port 5000
🌐 API URL: http://localhost:5000
```

## 🗄️ Database Connection

**MongoDB Atlas**: `mongodb+srv://2410030463:srikiran@cluster0.2cxzghy.mongodb.net/vaidya`

**Database Name**: `vaidya`

## 📁 Project Structure

```
backend/
├── models/              # Mongoose schemas
│   ├── Patient.js       # Patient model
│   ├── Doctor.js        # Doctor model
│   ├── Appointment.js   # Appointment model
│   ├── Vitals.js        # Vitals tracking model
│   ├── HealthRecord.js  # Health records model
│   └── Prescription.js  # Prescription model
├── routes/              # API routes
│   ├── auth.js          # Authentication endpoints
│   ├── patient.js       # Patient endpoints
│   └── doctor.js        # Doctor endpoints
├── middleware/          # Custom middleware
│   └── auth.js          # JWT authentication middleware
├── .env                 # Environment variables
├── server.js            # Main server file
└── package.json         # Dependencies
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Start the Server
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Health Check
```
GET /api/health
```
Returns server status and database connection state.

### Authentication

**Sign Up**
```
POST /api/auth/signup
Body: {
  "role": "patient" | "doctor",
  "name": "string",
  "email": "string",
  "password": "string",
  "age": number,           // for patients
  "specialty": "string",   // for doctors
  "license": "string",     // for doctors
  "hospital": "string"     // for doctors
}
```

**Sign In**
```
POST /api/auth/signin
Body: {
  "email": "string",
  "password": "string",
  "role": "patient" | "doctor"
}
Response: {
  "token": "JWT_TOKEN",
  "userId": "string",
  "role": "string",
  "name": "string"
}
```

### Patient Endpoints

All patient endpoints require authentication header:
```
Authorization: Bearer <JWT_TOKEN>
```

**Get Profile**
```
GET /api/patient/profile
```

**Get Latest Vitals**
```
GET /api/patient/vitals/latest
```

**Add Vitals**
```
POST /api/patient/vitals
Body: {
  "label": "Heart Rate",
  "value": "72 bpm",
  "status": "normal"
}
```

**Get Upcoming Appointment**
```
GET /api/patient/appointments/upcoming
```

**Get All Appointments**
```
GET /api/patient/appointments
```

**Book Appointment**
```
POST /api/patient/appointments
Body: {
  "doctorId": "string",
  "date": "2025-01-25",
  "time": "3:00 PM",
  "type": "Video Consultation"
}
```

**Get Recent Health Records**
```
GET /api/patient/records/recent
```

**Get All Health Records**
```
GET /api/patient/records
```

**Get Consultation History**
```
GET /api/patient/consultations
```

### Doctor Endpoints

All doctor endpoints require authentication header:
```
Authorization: Bearer <JWT_TOKEN>
```

**Get Profile**
```
GET /api/doctor/profile
```

**Get Statistics**
```
GET /api/doctor/stats
```

**Get Today's Schedule**
```
GET /api/doctor/consultations/upcoming
```

**Get Recent Patients**
```
GET /api/doctor/patients/recent
```

**Get Full Schedule**
```
GET /api/doctor/schedule
```

**Get All Patients**
```
GET /api/doctor/patients
```

**Get Consultation History**
```
GET /api/doctor/consultations
```

**Get Prescriptions**
```
GET /api/doctor/prescriptions
```

**Create Prescription**
```
POST /api/doctor/prescriptions
Body: {
  "patientId": "string",
  "medications": [{
    "name": "Aspirin",
    "dosage": "75mg",
    "frequency": "Once daily",
    "duration": "30 days"
  }],
  "diagnosis": "string",
  "notes": "string"
}
```

**Get Messages**
```
GET /api/doctor/messages
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

1. **Sign up** or **Sign in** to get a token
2. Include the token in all subsequent requests:
   ```
   Authorization: Bearer <your_token_here>
   ```
3. Tokens are valid for **7 days**

## 🗃️ Database Models

### Patient
- name, email, password
- age, phone, address, bloodGroup
- emergencyContact, medicalHistory, allergies, currentMedications

### Doctor
- name, email, password
- specialty, license, hospital
- phone, experience, qualification, consultationFee
- availability, rating, totalReviews

### Appointment
- patientId, doctorId
- date, time, type, status, priority
- symptoms, notes, meetingLink, duration

### Vitals
- patientId
- label, value, status, unit
- recordedBy, deviceId

### HealthRecord
- patientId, doctorId
- title, type, doctor, date
- description, fileUrl, attachments

### Prescription
- patientId, doctorId, appointmentId
- medications[], diagnosis, notes
- date, validUntil, status

## 🛠️ Environment Variables

Located in `.env` file:

```env
MONGODB_URI=mongodb+srv://2410030463:srikiran@cluster0.2cxzghy.mongodb.net/vaidya
JWT_SECRET=vaidya_secret_key_change_in_production_2025
PORT=5000
NODE_ENV=development
```

## 🔄 CORS Configuration

The server allows requests from:
- `http://localhost:8080` (Frontend)

To add more origins, modify `server.js`:
```javascript
app.use(cors({
  origin: ['http://localhost:8080', 'https://yourapp.com'],
  credentials: true
}));
```

## 📊 Data Flow

1. **Frontend** sends HTTP request with JWT token
2. **Middleware** verifies token
3. **Route handler** processes request
4. **Database** query/update via Mongoose
5. **Response** sent back to frontend

## 🧪 Testing the API

### Using curl:

**Sign Up:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "role": "patient",
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "age": 35
  }'
```

**Sign In:**
```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "role": "patient"
  }'
```

**Get Profile (with token):**
```bash
curl http://localhost:5000/api/patient/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔧 Troubleshooting

### MongoDB Connection Issues
- Verify your IP is whitelisted in MongoDB Atlas
- Check the connection string is correct
- Ensure password doesn't contain special characters

### CORS Errors
- Make sure frontend is running on `http://localhost:8080`
- Check CORS configuration in `server.js`

### Token Errors
- Token might be expired (valid for 7 days)
- Sign in again to get a new token

## 📝 Notes

- All passwords are hashed using bcryptjs
- JWT tokens expire after 7 days
- Database uses MongoDB Atlas (cloud)
- Server runs on port 5000 by default

## 🎯 Next Steps

1. Test all endpoints with Postman or curl
2. Add more patient/doctor data through frontend
3. Implement file upload for health records
4. Add real-time features with WebSockets
5. Implement email notifications
