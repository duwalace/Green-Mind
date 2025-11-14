import axios from 'axios';

// Usar variável de ambiente ou fallback para localhost
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

console.log('🌐 API Service inicializado com URL:', apiUrl);

// Create axios instance with default config
const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - adds token to all requests
api.interceptors.request.use((config) => {
  console.log('Making request to:', config.baseURL + config.url);
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor - handles common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      status: error.response?.status,
      message: error.message
    });
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Redirect to login page if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;