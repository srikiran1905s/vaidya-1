# Vaidya Telemedicine Platform - Setup Guide

## Prerequisites
- Python 3.8+
- Git

## Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/srikiran1905s/vaidya-1.git
cd vaidya-1
```

### 2. Set Up Environment Variables
Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```
GROQ_API_KEY=gsk_your_actual_groq_api_key_here
JWT_SECRET=your_random_secret_key
PORT=5000
```

**Get your Groq API key:** https://console.groq.com/keys

### 3. Install Backend Dependencies
```bash
cd backend_flask
pip install -r requirements.txt
```

### 4. Run the Application
```bash
python app.py
```

The application will be available at: http://localhost:5000

## Default Login Credentials

### Patient Accounts
- Email: `john@example.com` | Password: `password123`
- Email: `emma@example.com` | Password: `password123`
- Email: `michael@example.com` | Password: `password123`

### Doctor Accounts
- Email: `sarah.johnson@hospital.com` | Password: `password123`
- Email: `david.chen@hospital.com` | Password: `password123`
- Email: `priya.patel@hospital.com` | Password: `password123`

## Features
- ✅ Patient & Doctor Dashboards
- ✅ Appointment Booking with Type Selection
- ✅ Weekly Calendar View
- ✅ Doctor Schedule Management
- ✅ Prescription System
- ✅ Health Records & Vitals Tracking
- ✅ AI Health Assistant (Groq)
- ✅ Video Consultation Interface

## Important Notes
- Never commit your `.env` file to version control
- Keep your API keys secure
- Change default passwords in production
