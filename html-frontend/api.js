// API Service for Vaidya Application
// Use relative URL for production (when served from same domain) or localhost for development
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : '/api';

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
      let errorMsg = 'API request failed';
      try {
        const error = await response.json();
        errorMsg = error.error || errorMsg;
      } catch (e) {
        errorMsg = `Server error: ${response.status}`;
      }
      throw new Error(errorMsg);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else {
      throw new Error('Server returned non-JSON response');
    }
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
  
  cancelAppointment: (appointmentId) => apiCall(`/patient/appointments/${appointmentId}/cancel`, {
    method: 'POST',
  }),
  
  getPrescriptions: () => apiCall('/patient/prescriptions'),
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
  
  getPatients: () => apiCall('/doctor/patients'),
};

// Common APIs
const commonAPI = {
  getAllDoctors: () => apiCall('/doctors'),
};

// AI Assistant API
const AI_API_KEY = 'YOUR_GROQ_API_KEY_HERE'; // Replace with your Groq API key

const aiAPI = {
  sendMessage: async (message) => {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{
            role: 'system',
            content: 'You are a helpful medical AI assistant. Provide health information and guidance, but always remind users to consult with healthcare professionals for serious concerns.'
          }, {
            role: 'user',
            content: message
          }],
          max_tokens: 1000,
          temperature: 0.7
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content;
      } else {
        throw new Error('Invalid response from AI');
      }
    } catch (error) {
      console.error('AI API Error:', error);
      throw new Error(error.message || 'AI service unavailable');
    }
  }
};
