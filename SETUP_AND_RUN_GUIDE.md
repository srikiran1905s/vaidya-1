# 🚀 Vaidya Telemedicine Platform - Complete Setup & Run Guide

## ✅ Current Status: FULLY CONNECTED!

Your frontend, backend, and database are **already connected** and ready to use! 🎉

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (HTML/JS)                        │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   index.html │  │ signin.html  │  │ signup.html  │       │
│  │ patient-dash │  │ doctor-dash  │  │   api.js     │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          │ HTTP Requests    │                  │
          └──────────────────┴──────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (Node.js/Express)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ server.js    │→│ routes/auth   │→│ middleware/   │      │
│  │ PORT: 5000   │ │ routes/patient│ │ auth.js       │      │
│  └──────┬───────┘ │ routes/doctor │ └───────────────┘      │
│         │         └──────┬────────┘                         │
│         │                │                                  │
│         │                ▼                                  │
│         │      ┌─────────────────────┐                      │
│         │      │   Models (Mongoose) │                      │
│         │      │  • Patient.js       │                      │
│         │      │  • Doctor.js        │                      │
│         │      │  • Appointment.js   │                      │
│         │      │  • Vitals.js        │                      │
│         │      └─────────┬───────────┘                      │
└─────────┼────────────────┼──────────────────────────────────┘
          │                │
          │                ▼
┌─────────┼────────────────────────────────────────────────────┐
│         │         DATABASE (MongoDB Atlas)                   │
│         │         cluster0.2cxzghy.mongodb.net               │
│         │         Database: vaidya                           │
│         │                                                    │
│         │         Collections:                               │
│         └─────────→  • patients                              │
│                     • doctors                                │
│                     • appointments                           │
│                     • vitals                                 │
│                     • healthrecords                          │
│                     • prescriptions                          │
└──────────────────────────────────────────────────────────────┘
```

---

## 🎯 Quick Start (3 Steps)

### Step 1: Start the Backend Server
```powershell
cd backend
node server.js
```

**Expected Output:**
```
🚀 Server running on port 5000
🌐 Environment: development
✅ MongoDB Connected Successfully!
📊 Database: vaidya
💚 Health check: http://localhost:5000/api/health
```

### Step 2: Access the Application
Open your browser and go to:
```
http://localhost:5000
```

This will load the frontend (which is served by the backend).

### Step 3: Test the Connection
- Click "Sign Up" to create a new account (Patient or Doctor)
- Or click "Sign In" if you already have an account
- The frontend will communicate with the backend API automatically!

---

## 🔌 How Everything Is Connected

### Frontend → Backend Connection

**File: `html-frontend/api.js`**
```javascript
// Automatically detects if running locally or in production
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api'  // Development
  : '/api';                       // Production
```

This means:
- ✅ When you access `http://localhost:5000`, the frontend knows to call `http://localhost:5000/api/*`
- ✅ In production (deployed), it will use relative URLs like `/api/*`
- ✅ No manual configuration needed!

### Backend → Database Connection

**File: `backend/.env`**
```env
MONGODB_URI=mongodb+srv://2410030463:srikiran@cluster0.2cxzghy.mongodb.net/vaidya?retryWrites=true&w=majority
JWT_SECRET=vaidya_secret_key_change_in_production_2025
PORT=5000
NODE_ENV=development
```

**File: `backend/server.js`**
```javascript
await mongoose.connect(process.env.MONGODB_URI);
// ✅ Connects to MongoDB Atlas cloud database
```

### Backend → Frontend Static Files

**File: `backend/server.js`**
```javascript
// Serve static files from html-frontend directory
app.use(express.static(path.join(__dirname, '../html-frontend')));
```

This means:
- ✅ Backend serves all HTML/CSS/JS files from `html-frontend` folder
- ✅ When you visit `http://localhost:5000`, it loads `html-frontend/index.html`
- ✅ All frontend files are accessible at the root URL

---

## 📡 Available API Endpoints

### Authentication
- **POST** `/api/auth/signup` - Create new patient/doctor account
- **POST** `/api/auth/signin` - Sign in to account

### Patient APIs
- **GET** `/api/patient/profile` - Get patient profile
- **GET** `/api/patient/vitals/latest` - Get latest vitals
- **POST** `/api/patient/vitals` - Add new vitals
- **GET** `/api/patient/appointments` - Get all appointments
- **POST** `/api/patient/appointments` - Book new appointment
- **GET** `/api/patient/records` - Get health records
- **POST** `/api/patient/records` - Add health record

### Doctor APIs
- **GET** `/api/doctor/profile` - Get doctor profile
- **GET** `/api/doctor/stats` - Get doctor statistics
- **GET** `/api/doctor/consultations/upcoming` - Get upcoming consultations
- **GET** `/api/doctor/patients/recent` - Get recent patients
- **GET** `/api/doctor/schedule` - Get schedule
- **GET** `/api/doctor/prescriptions` - Get prescriptions
- **POST** `/api/doctor/prescriptions` - Create prescription

### Health Check
- **GET** `/api/health` - Check if backend is running
- **GET** `/api` - Get API information

---

## 🧪 Testing the Integration

### 1. Test Backend Health
```powershell
# In a new terminal
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Vaidya API is running",
  "database": "Connected"
}
```

### 2. Test Database Connection
```powershell
cd backend
node test-db-connection.js
```

**Expected Output:**
```
✅ MongoDB Connection SUCCESSFUL!
📊 Database Details:
   - Name: vaidya
   - Collections found: 6
     • patients
     • doctors
     • appointments
     • vitals
     • healthrecords
     • prescriptions
```

### 3. Test User Signup (Manual)
1. Open `http://localhost:5000/signup.html`
2. Fill in the form:
   - Name: Test Patient
   - Email: test@example.com
   - Password: password123
   - Select Role: Patient
3. Click "Sign Up"
4. You should be redirected to the patient dashboard!

### 4. Test Database via MongoDB
You can check if data was saved using MongoDB Compass or the web interface:
- Connection String: `mongodb+srv://2410030463:srikiran@cluster0.2cxzghy.mongodb.net/`
- Database: `vaidya`
- Check the `patients` collection for the new user

---

## 🗄️ Database Schema

### Collections Already Created

#### 1. **patients**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  age: Number,
  phone: String,
  dateOfBirth: Date,
  gender: String,
  bloodGroup: String,
  address: Object,
  medicalHistory: Array,
  allergies: Array,
  emergencyContact: Object
}
```

#### 2. **doctors**
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  specialty: String,
  license: String,
  hospital: String,
  experience: Number,
  qualifications: Array,
  consultationFee: Number,
  availability: Array,
  rating: Number,
  reviews: Array
}
```

#### 3. **appointments**
```javascript
{
  patient: ObjectId (ref: Patient),
  doctor: ObjectId (ref: Doctor),
  date: Date,
  time: String,
  type: String,
  status: String,
  meetingLink: String
}
```

#### 4. **vitals**
```javascript
{
  patient: ObjectId (ref: Patient),
  heartRate: Number,
  bloodPressure: String,
  temperature: Number,
  weight: Number,
  height: Number,
  timestamp: Date
}
```

#### 5. **healthrecords**
```javascript
{
  patient: ObjectId (ref: Patient),
  type: String,
  title: String,
  description: String,
  doctor: String,
  date: Date,
  fileUrl: String
}
```

#### 6. **prescriptions**
```javascript
{
  patient: ObjectId (ref: Patient),
  doctor: ObjectId (ref: Doctor),
  medications: Array,
  diagnosis: String,
  notes: String,
  date: Date
}
```

---

## 🔐 Security Features

### Password Security
- ✅ Passwords are hashed using **bcrypt** (salt rounds: 10)
- ✅ Plain passwords are never stored in database
- ✅ Passwords excluded from API responses

### JWT Authentication
- ✅ JSON Web Tokens (JWT) for session management
- ✅ Token expires in 7 days
- ✅ Token stored in `localStorage` on frontend
- ✅ Authorization header: `Bearer <token>`

### CORS Protection
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
```

---

## 📝 Environment Variables

**File: `backend/.env`**

| Variable | Description | Current Value |
|----------|-------------|---------------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT signing | `vaidya_secret_key...` |
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `FRONTEND_URL` | Frontend URL (optional) | `http://localhost:8080` |

**⚠️ Security Note:** Change `JWT_SECRET` in production!

---

## 🚀 Development Workflow

### Running the Full Stack Locally

**Terminal 1 - Backend:**
```powershell
cd backend
node server.js
```

**Browser:**
```
http://localhost:5000
```

That's it! The backend serves the frontend automatically.

### Using Live Reload (Optional)

For backend development with auto-restart:
```powershell
cd backend
npm run dev
# Uses nodemon - server restarts on file changes
```

---

## 🌐 Deployment (Production)

### Option 1: Deploy to Render (Recommended)
See `RENDER_DEPLOY_GUIDE.md` for detailed instructions.

Quick steps:
1. Push code to GitHub
2. Connect to Render
3. Configure:
   - Build Command: `npm install`
   - Start Command: `node backend/server.js`
   - Environment Variables: Add from `.env`
4. Deploy!

### Option 2: Deploy to Heroku
```powershell
heroku create vaidya-app
heroku config:set MONGODB_URI="your-mongodb-uri"
heroku config:set JWT_SECRET="your-jwt-secret"
git push heroku main
```

### Option 3: Deploy to Vercel
```powershell
vercel --prod
```

**Note:** In production, make sure to:
- ✅ Change `JWT_SECRET` to a strong random string
- ✅ Use environment variables (don't commit `.env`)
- ✅ Enable HTTPS
- ✅ Set proper CORS origins

---

## 🆘 Troubleshooting

### Issue: "Cannot connect to database"
**Solution:**
1. Check internet connection
2. Verify MongoDB URI in `.env` file
3. Check MongoDB Atlas cluster is active
4. Test with: `node backend/test-db-connection.js`

### Issue: "Port 5000 already in use"
**Solution:**
```powershell
# Find and kill the process using port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in .env file
PORT=3000
```

### Issue: "API calls failing / CORS error"
**Solution:**
1. Make sure backend is running
2. Check browser console for errors
3. Verify API URL in `html-frontend/api.js`
4. Test backend health: `http://localhost:5000/api/health`

### Issue: "Login not working"
**Solution:**
1. Check browser console for error messages
2. Verify credentials are correct
3. Test signup first to create a user
4. Check MongoDB to verify user was created
5. Ensure JWT_SECRET is set in `.env`

### Issue: "Frontend shows blank page"
**Solution:**
1. Check browser console for JavaScript errors
2. Verify backend is serving static files
3. Check `server.js` has: `app.use(express.static(...))`
4. Try clearing browser cache

---

## 📚 Additional Resources

- **API Documentation:** See `API_DOCUMENTATION.md`
- **Schema Details:** See `SCHEMA_CHANGES.md`
- **Backend Integration:** See `BACKEND_INTEGRATION_GUIDE.md`
- **Deployment Guide:** See `RENDER_DEPLOY_GUIDE.md`

---

## ✨ Features Already Implemented

### Frontend ✅
- Landing page with hero section
- Patient/Doctor signup and signin
- Patient dashboard with vitals, appointments, records
- Doctor dashboard with schedule, patients, prescriptions
- Responsive design (works on mobile/tablet/desktop)
- Beautiful UI with Tailwind CSS

### Backend ✅
- RESTful API with Express.js
- MongoDB integration with Mongoose
- JWT authentication
- Password hashing with bcrypt
- Input validation with express-validator
- Error handling middleware
- CORS protection
- Static file serving

### Database ✅
- MongoDB Atlas cloud database
- 6 collections (patients, doctors, appointments, etc.)
- Comprehensive schemas with validation
- Indexes for query optimization
- Virtual fields and helper methods

---

## 🎉 You're All Set!

Your Vaidya Telemedicine Platform is **fully connected** and ready to use!

### Next Steps:
1. ✅ **Start the server:** `node backend/server.js`
2. ✅ **Open browser:** `http://localhost:5000`
3. ✅ **Create an account:** Try signing up as a patient or doctor
4. ✅ **Explore features:** Navigate through dashboards
5. ✅ **Add data:** Test appointments, vitals, health records

### Need Help?
- Check the troubleshooting section above
- Review the API documentation
- Check browser console for error messages
- Test database connection with the test script

---

**Created by:** Cascade AI Assistant  
**Date:** October 29, 2025  
**Status:** ✅ Fully Connected & Ready to Use

Happy Coding! 🚀💚
