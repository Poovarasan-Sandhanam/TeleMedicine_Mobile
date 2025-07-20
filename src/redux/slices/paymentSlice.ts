import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utilis/api';

// Types
interface PaymentState {
  loading: boolean;
  data: any | null;
  error: string | null;
}

const initialState: PaymentState = {
  loading: false,
  data: null,
  error: null,
};

// Async thunks
export const bookNow = createAsyncThunk(
  'payment/bookNow',
  async (appointmentId: string, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token is missing');
      }

      const headers = { Authorization: `Bearer ${token}` };
      const response = await api.post(
        '/payment/book-now',
        { appointmentId },
        { headers }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

// Slice
const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearPaymentError: (state) => {
      state.error = null;
    },
    clearPaymentData: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bookNow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookNow.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(bookNow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPaymentError, clearPaymentData } = paymentSlice.actions;
export default paymentSlice.reducer; 