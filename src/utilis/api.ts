import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

import { API_BASE_URL, IS_PROD_URL_CONFIGURED } from '../config/env';

if (!__DEV__ && !IS_PROD_URL_CONFIGURED) {
  console.error(
    '[api] PROD_API_URL is still a placeholder in src/config/env.ts - ' +
    'release builds cannot reach the backend.'
  );
}

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
