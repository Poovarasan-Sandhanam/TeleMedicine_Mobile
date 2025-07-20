import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utilis/api';

// Types
interface AppointmentRecordState {
  loading: boolean;
  appointmentRec: any[];
  error: string | null;
}

const initialState: AppointmentRecordState = {
  loading: false,
  appointmentRec: [],
  error: null,
};

// Async thunks
export const fetchAppointments = createAsyncThunk(
  'appointmentRecord/fetchAppointments',
  async (date: string, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token is missing.');
      }

      const headers = { Authorization: `Bearer ${token}` };
      const response = await api.get('/appointment/get-all-appointments', {
        headers,
        params: { date },
      });

      return response.data.data;
    } catch (error: any) {
      console.error(error, "Fetch Appointments Error");
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Slice
const appointmentRecordSlice = createSlice({
  name: 'appointmentRecord',
  initialState,
  reducers: {
    clearAppointmentRecordError: (state) => {
      state.error = null;
    },
    clearAppointmentRecords: (state) => {
      state.appointmentRec = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointmentRec = action.payload || [];
        state.error = null;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.appointmentRec = [];
        state.error = action.payload as string;
      });
  },
});

export const { clearAppointmentRecordError, clearAppointmentRecords } = appointmentRecordSlice.actions;
export default appointmentRecordSlice.reducer; 