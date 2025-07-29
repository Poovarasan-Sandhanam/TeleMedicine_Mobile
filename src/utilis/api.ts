import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

const API_BASE_URL = 'http://10.0.2.2:3001/api/v1'; // For Android emulator
// const API_BASE_URL = 'http://localhost:3001/api/v1'; // For iOS simulator
// const API_BASE_URL = 'https://your-production-api.com/api/v1'; // For production

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

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    // const token = await AsyncStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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