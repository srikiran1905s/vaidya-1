# Vaidya - HTML/CSS/JS Frontend

This is the plain HTML, CSS, and JavaScript version of the Vaidya healthcare application, converted from React/TypeScript.

## 📁 File Structure

```
html-frontend/
├── index.html              # Landing page
├── signin.html             # Sign in page
├── signup.html             # Sign up page
├── patient-dashboard.html  # Patient dashboard
├── doctor-dashboard.html   # Doctor dashboard
├── styles.css              # Custom CSS styles
├── api.js                  # API service layer
├── app.js                  # Common utility functions
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Backend API running on `http://localhost:5000` (see backend folder)

### Running the Application

1. **Simple Method (Local File System):**
   - Simply open `index.html` in your web browser
   - Note: Some features may not work due to CORS restrictions

2. **Recommended Method (Local Server):**
   
   **Using Python:**
   ```bash
   # Python 3
   python -m http.server 8080
   
   # Python 2
   python -m SimpleHTTPServer 8080
   ```
   
   **Using Node.js (http-server):**
   ```bash
   npx http-server -p 8080
   ```
   
   **Using PHP:**
   ```bash
   php -S localhost:8080
   ```
   
   Then open `http://localhost:8080` in your browser.

## 📄 Pages Overview

### 1. Landing Page (`index.html`)
- Hero section with call-to-action
- Features showcase
- Testimonials
- Footer with links

### 2. Sign In Page (`signin.html`)
- Email and password login
- Role selection (Patient/Doctor)
- Integration with backend API
- Toast notifications

### 3. Sign Up Page (`signup.html`)
- User registration form
- Role-based fields (Patient/Doctor)
- Form validation
- Password confirmation

### 4. Patient Dashboard (`patient-dashboard.html`)
- Sidebar navigation
- Dashboard overview
- Appointments management
- Health records
- Vitals tracking
- Video consultations
- AI assistant chat
- Profile settings

### 5. Doctor Dashboard (`doctor-dashboard.html`)
- Sidebar navigation
- Statistics dashboard
- Schedule management
- Patient database
- Consultation history
- Prescription management
- Messages
- Settings

## 🎨 Styling

The application uses:
- **Tailwind CSS** (CDN) for utility-first styling
- **Custom CSS** (`styles.css`) for:
  - Animations
  - Custom components
  - Theme variables
  - Responsive design

## 🔧 JavaScript Files

### `api.js`
API service layer that handles all backend communications:
- Token management (localStorage)
- Authentication APIs (signin, signup)
- Patient APIs (profile, vitals, appointments, records)
- Doctor APIs (profile, stats, consultations, prescriptions)
- Error handling

### `app.js`
Common utility functions:
- Authentication checks
- Toast notification system
- Date/time formatting
- Loading states
- Empty state helpers
- Error handling
- Debounce utility

## 🔐 Authentication

The application uses JWT token-based authentication:
1. User signs in with credentials
2. Token is stored in `localStorage`
3. Token is sent with each API request in the `Authorization` header
4. Protected pages check for token on load

## 🌐 API Configuration

The API base URL is set in `api.js`:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

Change this to your backend URL if different.

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Breakpoints for tablets and desktop
- Collapsible sidebar on mobile
- Optimized layouts for all screen sizes

## 🎯 Features

### Patient Features
- ✅ Dashboard with health overview
- ✅ Book and manage appointments
- ✅ View health records
- ✅ Track vitals
- ✅ Video consultations
- ✅ AI health assistant
- ✅ Profile management

### Doctor Features
- ✅ Statistics dashboard
- ✅ Schedule management
- ✅ Patient database
- ✅ Consultation management
- ✅ Write prescriptions
- ✅ Patient messages
- ✅ Profile settings

## 🔄 Data Flow

1. **User Authentication:**
   - User enters credentials → API call → Token received → Token stored → Redirect to dashboard

2. **Data Loading:**
   - Dashboard loads → Check token → API calls → Display data → Handle errors

3. **User Actions:**
   - User clicks button → Show loading → API call → Update UI → Show notification

## 🎨 Customization

### Colors
Edit the CSS variables in `styles.css`:
```css
:root {
  --primary: hsl(174, 62%, 47%);
  --secondary: hsl(217, 91%, 60%);
  --accent: hsl(174, 70%, 95%);
  --muted: hsl(210, 15%, 50%);
}
```

### API Endpoint
Edit in `api.js`:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## 🐛 Troubleshooting

### CORS Issues
If you see CORS errors:
1. Make sure backend is running with CORS enabled
2. Use a local server (not file://)
3. Check backend CORS configuration

### API Connection Failed
1. Verify backend is running on port 5000
2. Check `API_BASE_URL` in `api.js`
3. Check browser console for errors

### Token Expired
- Tokens expire after a certain time
- User will be redirected to sign in page
- Need to implement token refresh mechanism

## 🚧 Future Enhancements

- [ ] Real-time chat using WebSockets
- [ ] Video calling integration
- [ ] Push notifications
- [ ] Service worker for offline support
- [ ] Progressive Web App (PWA) features
- [ ] Token refresh mechanism
- [ ] Password reset functionality
- [ ] Email verification
- [ ] Multi-language support

## 📝 Notes

- This is a client-side only application
- All data is fetched from the backend API
- No build process required
- Works with modern browsers (ES6+)
- Mobile-responsive and accessible

## 🔗 Related Files

- Backend API: `../backend/`
- API Documentation: `../API_DOCUMENTATION.md`
- Backend Integration: `../BACKEND_INTEGRATION_GUIDE.md`

## 📄 License

Copyright © 2025 Vaidya. All rights reserved.
