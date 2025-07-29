// src/redux/slices/authSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../utilis/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  email: string;
  fullName: string;
  isDoctor: boolean;
  token: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// SIGNUP
export const signup = createAsyncThunk(
  'auth/signup',
  async (
    userData: {
      fullName: string;
      email: string;
      password: string;
      confirmPassword: string;
      role: 'DOCTOR' | 'PATIENT';
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post('/auth/register', userData);
      const result = response.data?.data;

      if (result?.token) {
        await AsyncStorage.setItem('user', JSON.stringify(result));
        return result;
      }

      return rejectWithValue('Signup failed: Missing token');
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Signup failed';
      return rejectWithValue(errorMessage);
    }
  }
);

// LOGIN
export const login = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const user = response.data?.data;

      if (!user?.token) {
        throw new Error('Invalid login response: Missing token');
      }

      await AsyncStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Login failed';
      return rejectWithValue(errorMessage);
    }
  }
);

// LOGOUT
export const logout = createAsyncThunk('auth/logout', async () => {
  await AsyncStorage.removeItem('user');
});

// LOAD USER
export const loadUserFromStorage = createAsyncThunk(
  'auth/loadUserFromStorage',
  async (_, { rejectWithValue }) => {
    try {
      const userData = await AsyncStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return rejectWithValue('Failed to load user data');
    }
  }
);

// SLICE
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(signup.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(logout.fulfilled, state => {
        state.user = null;
        state.loading = false;
        state.error = null;
      })

      .addCase(loadUserFromStorage.pending, state => {
        state.loading = true;
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loadUserFromStorage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
