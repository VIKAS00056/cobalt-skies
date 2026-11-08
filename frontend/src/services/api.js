/**
 * Compute the base API URL dynamically from VITE_API_URL.
 * Supports:
 * - Empty / unset: defaults to '/api' (for local Vite proxy)
 * - Absolute backend URL: e.g. 'https://cobalt-skies-backend.onrender.com' -> 'https://cobalt-skies-backend.onrender.com/api'
 * - Absolute backend URL with /api: e.g. 'https://cobalt-skies-backend.onrender.com/api'
 */
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl || envUrl.trim() === '') {
    return '/api';
  }
  const cleanUrl = envUrl.trim().replace(/\/+$/, '');
  if (cleanUrl.endsWith('/api')) {
    return cleanUrl;
  }
  return `${cleanUrl}/api`;
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Universal API request wrapper
 */
export async function apiRequest(endpoint, { method = 'GET', data, headers = {} } = {}) {
  const token = localStorage.getItem('cs_token');

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  };

  if (data && method !== 'GET') {
    config.body = JSON.stringify(data);
  }

  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${normalizedEndpoint}`;
  const response = await fetch(url, config);

  // If response is a file download (like CSV)
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('text/csv')) {
    const blob = await response.blob();
    return blob;
  }

  let result;
  try {
    result = await response.json();
  } catch (err) {
    result = { success: false, message: 'Server communication error' };
  }

  if (!response.ok) {
    const error = new Error(result.message || 'Request failed');
    error.status = response.status;
    error.data = result;
    throw error;
  }

  return result;
}

export default apiRequest;
