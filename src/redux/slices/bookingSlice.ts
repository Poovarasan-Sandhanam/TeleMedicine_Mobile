import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utilis/api';

interface BookingState {
  loading: boolean;
  bookings: any[];
  error: string | null;
}

const initialState: BookingState = {
  loading: false,
  bookings: [],
  error: null,
};

/**
 * The signed-in user's bookings. Patients see appointments they booked; doctors see
 * appointments booked with them.
 *
 * Goes through the shared api client. This used to call fetch() on a hardcoded
 * http://localhost:3001, which on an Android emulator is the emulator itself, so the
 * request never reached the server - and every failure was swapped for sample data.
 */
export const fetchBookings = createAsyncThunk<any[], void, { rejectValue: string }>(
  'booking/fetchBookings',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const isDoctor = JSON.parse((await AsyncStorage.getItem('isDoctor')) ?? 'false');
      const path = isDoctor ? '/payment/get-bookings-users' : '/payment/get-bookings';

      const response = await api.get(path, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data?.data?.bookingDetails ?? [];
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Could not load bookings');
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    clearBookingError: (state) => {
      state.error = null;
    },
    clearBookings: (state) => {
      state.bookings = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Could not load bookings';
      });
  },
});

export const { clearBookingError, clearBookings } = bookingSlice.actions;
export default bookingSlice.reducer;
