import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

/**
 * Attaches the saved token to every request.
 *
 * This used to be commented out, so each slice read the token and built the
 * Authorization header itself - the same four lines in a dozen places, and a new
 * screen that forgot them failed with 401 for no obvious reason.
 *
 * A caller that passes its own Authorization header still wins: `resolveStartRoute`
 * validates a specific token at startup, before it is the "current" one.
 */
apiClient.interceptors.request.use(
  async (config) => {
    if (!config.headers?.Authorization) {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // Unreadable storage must not block the request - endpoints that need auth
        // will answer 401 and the response interceptor routes back to sign-in.
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/** Called when the server rejects the session (expired or revoked token). */
let onUnauthorized: (() => void) | null = null;
export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  onUnauthorized = handler;
};

// Add interceptors for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => response,
  (error: AxiosError<ApiError>) => {
    // A 401 means the token is no longer valid; send the user back to sign in
    // rather than leaving every screen failing. Sign-in itself answers 400.
    if (error.response?.status === 401) {
      onUnauthorized?.();
    }
    const message = error.response?.data?.message || error.message || 'Network error occurred';
    const customError = new Error(message) as Error & { status?: number };
    customError.status = error.response?.status;
    return Promise.reject(customError);
  }
);

/**
 * The user-facing message for a failed request. The response interceptor turns
 * Axios errors into plain Errors carrying the server's message, so
 * `error.response` no longer exists by the time slices see it - reading only
 * that path discarded messages such as "This appointment is already booked".
 */
export const errorMessage = (error: any, fallback: string): string =>
  error?.response?.data?.message || error?.message || fallback;

export default apiClient;
export type { ApiResponse, ApiError };
