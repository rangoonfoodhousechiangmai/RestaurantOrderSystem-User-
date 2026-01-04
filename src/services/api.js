import { BACKEND_URL } from './config';

// Simple API utility
async function apiRequest(endpoint, options = {}) {
  const url = `${BACKEND_URL}${endpoint}`;
  
  // Get session token
  const sessionToken = localStorage.getItem('tableSessionToken');
  
  // Default headers
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };
  
  // Add session token if exists
  if (sessionToken) {
    headers['X-Table-Session'] = sessionToken;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  
  // Handle session expiration
  if (response.status === 401) {
    localStorage.removeItem('tableSessionToken');
    localStorage.removeItem('tableNumber');
    // Optional: redirect to scan page
    // window.location.href = '/scan?session_expired=true';
    throw new Error('Session expired');
  }
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("404");
    }
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Request failed: ${response.status}`);
  }
  
  return await response.json();
}

// Convenience methods
export const api = {
  get: (endpoint, options) => apiRequest(endpoint, { method: 'GET', ...options }),
  post: (endpoint, data, options) => apiRequest(endpoint, { 
    method: 'POST', 
    body: data, 
    ...options 
  }),
  put: (endpoint, data, options) => apiRequest(endpoint, { 
    method: 'PUT', 
    body: data, 
    ...options 
  }),
  delete: (endpoint, options) => apiRequest(endpoint, { 
    method: 'DELETE', 
    ...options 
  }),
};