// API Service for Vaidya Application
const API_BASE_URL = 'http://localhost:5000/api';

// Token Management
const getToken = () => localStorage.getItem('authToken');

const setToken = (token) => {
  localStorage.setItem('authToken', token);
};

const removeToken = () => {
  localStorage.removeItem('authToken');
};

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'API request failed' }));
      throw new Error(error.error || 'API request failed');
    }

    return response.json();
  } catch (error) {
    throw error;
  }
};

// Auth APIs
const authAPI = {
  signup: (data) => apiCall('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  signin: (data) => apiCall('/auth/signin', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Patient APIs
const patientAPI = {
  getProfile: () => apiCall('/patient/profile'),
  
  getVitalsLatest: () => apiCall('/patient/vitals/latest'),
  
  addVitals: (data) => apiCall('/patient/vitals', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  getUpcomingAppointment: () => apiCall('/patient/appointments/upcoming'),
  
  getAppointments: () => apiCall('/patient/appointments'),
  
  bookAppointment: (data) => apiCall('/patient/appointments', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  getRecentRecords: () => apiCall('/patient/records/recent'),
  
  getHealthRecords: () => apiCall('/patient/records'),
  
  addHealthRecord: (data) => apiCall('/patient/records', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  getConsultations: () => apiCall('/patient/consultations'),
};

// Doctor APIs
const doctorAPI = {
  getProfile: () => apiCall('/doctor/profile'),
  
  getStats: () => apiCall('/doctor/stats'),
  
  getUpcomingConsultations: () => apiCall('/doctor/consultations/upcoming'),
  
  getRecentPatients: () => apiCall('/doctor/patients/recent'),
  
  getSchedule: () => apiCall('/doctor/schedule'),
  
  getPatients: () => apiCall('/doctor/patients'),
  
  getConsultations: () => apiCall('/doctor/consultations'),
  
  getPrescriptions: () => apiCall('/doctor/prescriptions'),
  
  createPrescription: (data) => apiCall('/doctor/prescriptions', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  getMessages: () => apiCall('/doctor/messages'),
};
