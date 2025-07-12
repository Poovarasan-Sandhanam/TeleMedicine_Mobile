import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

const API_BASE_URL = 'http://localhost:3001/api/v1'; // Replace with production URL if needed

interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
}

interface ApiError {
  message: string;
  status?: number;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Timeout after 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => response,
  (error: AxiosError<ApiError>) => {
    const message = error.response?.data?.message || error.message || 'Network error occurred';
    const customError = new Error(message) as Error & { status?: number };
    customError.status = error.response?.status;
    return Promise.reject(customError);
  }
);

export default apiClient;
export type { ApiResponse, ApiError }; 