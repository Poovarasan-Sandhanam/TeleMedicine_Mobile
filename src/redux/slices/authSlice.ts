import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utilis/api';
import { errorMessage as toErrorMessage } from '../../utilis/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ---- Types ----
interface User {
  email: string;
  fullName: string;
  isDoctor: boolean;
  token: string;
  role?: string; // optional, depending on signup response
}

interface AuthState {
  user: User | null;
  token: string | null;
  isDoctor: boolean | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isDoctor: null,
  loading: false,
  error: null,
};
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, fullName, email: userEmail, isDoctor } = response.data.data;

      console.log('Login successful:', response.data);
      console.log('isDoctor', response.data.data.isDoctor);

      // Construct the user object to store in Redux and AsyncStorage
      const user = {
        email: userEmail,
        fullName,
        token,
        isDoctor,
      };

      // Store token and user data in AsyncStorage
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('isDoctor', JSON.stringify(isDoctor));
      await AsyncStorage.setItem('user', JSON.stringify(user));

      return user;
    } catch (error: any) {
      const errorMessage = toErrorMessage(error, 'Login failed.');
      console.log('Login Error:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', data);
      console.log('Signup success:', response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = toErrorMessage(error, 'An unexpected error occurred.');
      console.error('Signup failed:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Signs out on the server as well as on the device.
 *
 * Clearing AsyncStorage alone only forgets the token locally - it stays valid for
 * the rest of its 48 hours, so anyone who captured it could keep using the account
 * after the user thought they had signed out. POST /auth/logout revokes it.
 *
 * Never rejects. If the call fails (offline, server down) the user must still end up
 * signed out on this device, so the local session is cleared either way. A token we
 * could not revoke expires on its own.
 */
export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    try {
      // Cloud Run rejects a POST with no body as 411 before it reaches the API,
      // so send an empty object rather than nothing.
      await api.post('/auth/logout', {});
    } catch (error: any) {
      console.warn('Logout request failed; clearing local session anyway:', error?.message);
    }
    return null;
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.isDoctor = action.payload.isDoctor;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isDoctor = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});
export const { setLoading, setError, clearError } = authSlice.actions;
export default authSlice.reducer;
