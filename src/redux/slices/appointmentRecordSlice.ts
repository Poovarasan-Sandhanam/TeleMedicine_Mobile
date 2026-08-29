import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utilis/api';

// Types
interface AppointmentRecordState {
  loading: boolean;
  appointmentRec: any[];
  error: string | null;
}

const MOCK_APPOINTMENTS = [
  {
    _id: 'app1',
    doctorName: 'Dr. Sarah Jenkins',
    patientName: 'John Doe',
    specialization: 'Cardiology',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM - 10:30 AM',
    status: 'Confirmed',
    notes: 'Regular heart checkup and ECG review.',
  },
  {
    _id: 'app2',
    doctorName: 'Dr. Robert Chen',
    patientName: 'John Doe',
    specialization: 'Dermatology',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '02:00 PM - 02:30 PM',
    status: 'Pending',
    notes: 'Skin rash consultation.',
  },
];

const initialState: AppointmentRecordState = {
  loading: false,
  appointmentRec: MOCK_APPOINTMENTS,
  error: null,
};

// Async thunks
export const fetchAppointments = createAsyncThunk(
  'appointmentRecord/fetchAppointments',
  async (date: string, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return MOCK_APPOINTMENTS;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const response = await api.get('/appointment/get-all-appointments', {
        headers,
        params: { date },
      });

      return response.data.data && response.data.data.length > 0 ? response.data.data : MOCK_APPOINTMENTS;
    } catch (error: any) {
      return MOCK_APPOINTMENTS;
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
      state.appointmentRec = MOCK_APPOINTMENTS;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointmentRec = action.payload && action.payload.length > 0 ? action.payload : MOCK_APPOINTMENTS;
        state.error = null;
      })
      .addCase(fetchAppointments.rejected, (state) => {
        state.loading = false;
        state.appointmentRec = MOCK_APPOINTMENTS;
        state.error = null;
      });
  },
});

export const { clearAppointmentRecordError, clearAppointmentRecords } = appointmentRecordSlice.actions;
export default appointmentRecordSlice.reducer;
