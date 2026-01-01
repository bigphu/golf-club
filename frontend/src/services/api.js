const BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Generic API client wrapper
 */
export const api = {
  get: async (endpoint, token) => request(endpoint, 'GET', null, token),
  post: async (endpoint, body, token) => request(endpoint, 'POST', body, token),
  put: async (endpoint, body, token) => request(endpoint, 'PUT', body, token),
  delete: async (endpoint, token) => request(endpoint, 'DELETE', null, token),
};

async function request(endpoint, method, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const config = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || data.error || 'API Request Failed');
    }
    return data;
  } catch (error) {
    throw error;
  }
}