import axios from 'axios';
const API_BASE_URL = 'http://localhost:3000/api/v1'; // Replace with production URL if needed


const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Timeout after 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors for error handling (optional)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message;
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
