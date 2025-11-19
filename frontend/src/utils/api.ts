const API_BASE_URL = 'http://localhost:3001/api'; // Assuming backend runs on 3001

interface RequestOptions extends RequestInit {
  authToken?: string;
}

export const authenticatedFetch = async (endpoint: string, options: RequestOptions = {}) => {
  const token = options.authToken || localStorage.getItem('token');
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
  };

  if (token) {
    (headers as any)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || `API request failed with status ${response.status}`);
  }

  return response.json();
};