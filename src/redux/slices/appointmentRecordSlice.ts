import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utilis/api';

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

/** A doctor's appointments on one day. `date` is DD-MM-YYYY. */
export const fetchAppointments = createAsyncThunk<any[], string, { rejectValue: string }>(
  'appointmentRecord/fetchAppointments',
  async (date, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await api.get('/appointment/get-all-appointments', {
        headers: { Authorization: `Bearer ${token}` },
        params: { date },
      });
      return response.data?.data ?? [];
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Could not load appointments');
    }
  }
);

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
        state.appointmentRec = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.appointmentRec = [];
        state.error = action.payload ?? 'Could not load appointments';
      });
  },
});

export const { clearAppointmentRecordError, clearAppointmentRecords } = appointmentRecordSlice.actions;
export default appointmentRecordSlice.reducer;
