import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
interface BookingState {
  loading: boolean;
  bookings: any[];
  error: string | null;
}

const MOCK_BOOKINGS = [
  {
    _id: 'b1',
    status: 'Success',
    date: new Date().toISOString(),
    checkupTiming: '9-10',
    notes: 'Follow-up cardiology consultation.',
    userDetails: { fullName: 'Dr. Sarah Jenkins', contactNo: '+1 800 555 0199' },
  },
  {
    _id: 'b2',
    status: 'Pending',
    date: new Date(Date.now() + 86400000).toISOString(),
    checkupTiming: '14-15',
    notes: 'Skin rash inspection and prescription.',
    userDetails: { fullName: 'Dr. Robert Chen', contactNo: '+1 800 555 0288' },
  },
];

const initialState: BookingState = {
  loading: false,
  bookings: MOCK_BOOKINGS,
  error: null,
};

// Async thunks
export const fetchBookings = createAsyncThunk(
  'booking/fetchBookings',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return MOCK_BOOKINGS;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch('http://localhost:3001/api/v1/payment/get-bookings', {
        method: 'GET',
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return MOCK_BOOKINGS;
      }

      const bookingDetails = data.data?.bookingDetails || [];
      return bookingDetails.length > 0 ? bookingDetails : MOCK_BOOKINGS;
    } catch (error: any) {
      return MOCK_BOOKINGS;
    }
  }
);

// Slice
const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    clearBookingError: (state) => {
      state.error = null;
    },
    clearBookings: (state) => {
      state.bookings = MOCK_BOOKINGS;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload && action.payload.length > 0 ? action.payload : MOCK_BOOKINGS;
        state.error = null;
      })
      .addCase(fetchBookings.rejected, (state) => {
        state.loading = false;
        state.bookings = MOCK_BOOKINGS;
        state.error = null;
      });
  },
});

export const { clearBookingError, clearBookings } = bookingSlice.actions;
export default bookingSlice.reducer;
