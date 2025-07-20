import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utilis/api';

// Types
interface AppointmentData {
  doctorId: string;
  date: string;
  time: string;
  notes?: string;
  patientId?: string;
}

interface AppointmentState {
  appointment: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: AppointmentState = {
  appointment: null,
  loading: false,
  error: null,
};

// Async thunks
export const bookAppointment = createAsyncThunk(
  'appointment/bookAppointment',
  async (appointmentData: AppointmentData, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await api.post('/appointment/booking', appointmentData, { headers });
      console.log('Appointment Booking Successful:', response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to book appointment.';
      console.error('Appointment Booking Error:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Slice
const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    setAppointmentLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAppointmentError: (state, action) => {
      state.error = action.payload;
    },
    clearAppointmentError: (state) => {
      state.error = null;
    },
    clearAppointment: (state) => {
      state.appointment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bookAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointment = action.payload;
        state.error = null;
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  setAppointmentLoading, 
  setAppointmentError, 
  clearAppointmentError, 
  clearAppointment 
} = appointmentSlice.actions;
export default appointmentSlice.reducer; 