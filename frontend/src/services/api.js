const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

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

  const url = `${API_BASE_URL}${endpoint}`;
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
