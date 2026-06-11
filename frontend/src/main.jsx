import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx'; // 🌟 Make sure this is imported!

// Global fetch interceptor to append JWT token automatically and handle token expiration/auth errors
const originalFetch = window.fetch;
window.fetch = async (url, options = {}) => {
  const token = localStorage.getItem('ems_token');
  // Inject headers, retaining any existing headers
  const headers = { ...options.headers };
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  options.headers = headers;
  
  const response = await originalFetch(url, options);
  
  // If the server returns 401 Unauthorized or 403 Forbidden, the token is expired/invalid
  if (response.status === 401 || response.status === 403) {
    const currentPath = window.location.pathname;
    if (currentPath !== '/login' && currentPath !== '/signup') {
      localStorage.removeItem('ems_token');
      localStorage.removeItem('ems_user');
      localStorage.removeItem('ems_refresh');
      window.location.href = '/login';
    }
  }
  
  return response;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);