# 🏥 Vaidya - Telemedicine Healthcare Platform

A comprehensive telemedicine platform built with Node.js, Express, MongoDB, and vanilla JavaScript (HTML/CSS/JS).

## ✨ Features

- 🔐 User authentication (Patients & Doctors)
- 👤 Patient dashboard with health records, vitals, and appointments
- 👨‍⚕️ Doctor dashboard with patient management and consultations
- 💊 Prescription management system
- 📅 Real-time consultation scheduling
- 📊 Health analytics and vitals tracking
- 🔒 Secure JWT-based authentication

## 🛠️ Tech Stack

- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla), Tailwind CSS
- **Authentication:** JWT (JSON Web Tokens)
- **Database:** MongoDB Atlas
- **Deployment:** Render

## 📁 Project Structure

```
vaidya-healthcare/
├── backend/                 # Node.js API
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   ├── server.js           # Entry point
│   └── seed.js             # Database seeder
├── html-frontend/          # Vanilla JS frontend
│   ├── index.html          # Landing page
│   ├── signin.html         # Sign in page
│   ├── signup.html         # Sign up page
│   ├── patient-dashboard.html
│   ├── doctor-dashboard.html
│   ├── api.js              # API service layer
│   ├── app.js              # Utilities
│   └── styles.css          # Custom styles
└── DEPLOYMENT.md           # Deployment guide
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Python (for frontend server)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/srikiran1905s/FEDF.git
   cd FEDF
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables**
   Create `.env` file in backend directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   PORT=5000
   NODE_ENV=development
   ```

4. **Seed the database**
   ```bash
   npm run seed
   ```

5. **Start the backend server**
   ```bash
   npm start
   ```

6. **Start the frontend server** (in a new terminal)
   ```bash
   cd ../html-frontend
   python -m http.server 8080
   ```

7. **Access the application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:5000

## 🔐 Test Credentials

### Doctors
- Email: `sarah.johnson@hospital.com` | Password: `password123`
- Email: `david.chen@hospital.com` | Password: `password123`

### Patients
- Email: `john@example.com` | Password: `password123`
- Email: `emma@example.com` | Password: `password123`

## 📦 Deployment to Render

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

### Quick Deploy Steps

1. **Configure Render Service**
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

2. **Set Environment Variables** in Render dashboard

3. **Deploy Frontend** as Static Site
   - Root Directory: `html-frontend`

## 📚 Documentation

- [API Documentation](./API_DOCUMENTATION.md)
- [Backend Integration Guide](./BACKEND_INTEGRATION_GUIDE.md)
- [Frontend README](./html-frontend/README.md)
- [Deployment Guide](./DEPLOYMENT.md)

## 👨‍💻 Author

Srikiran - [GitHub](https://github.com/srikiran1905s)

## 📝 License

MIT

The application will be available at `http://localhost:8080`

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Deployment

You can deploy this project to various hosting platforms:

- **Netlify**: Connect your repository and deploy automatically
- **Vercel**: Push to GitHub and import the project
- **GitHub Pages**: Use GitHub Actions for deployment

Build the project for production:

```sh
npm run build
```

The optimized files will be in the `dist` folder.
