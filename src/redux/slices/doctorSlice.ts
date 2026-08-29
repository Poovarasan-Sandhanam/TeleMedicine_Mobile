import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utilis/api';

// Types
interface DoctorState {
  doctors: any[];
  doctorDetails: any | null;
  error: string | null;
}

const MOCK_DOCTOR_DETAILS = {
  id: 'doc1',
  fullName: 'Dr. Sarah Jenkins',
  specialization: 'Cardiology',
  slots: [
    { slotTiming: '09:00 AM - 09:30 AM', isBooked: false },
    { slotTiming: '10:00 AM - 10:30 AM', isBooked: true },
    { slotTiming: '11:00 AM - 11:30 AM', isBooked: false },
    { slotTiming: '02:00 PM - 02:30 PM', isBooked: false },
    { slotTiming: '03:30 PM - 04:00 PM', isBooked: false },
  ],
};

const initialState: DoctorState = {
  doctors: [],
  doctorDetails: MOCK_DOCTOR_DETAILS,
  error: null,
};

// Async thunks
export const fetchAllDoctors = createAsyncThunk(
  'doctor/fetchAllDoctors',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await api.get('/appointment/get-all-doctors', { headers });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDoctorDetails = createAsyncThunk(
  'doctor/fetchDoctorDetails',
  async ({ id, selectedDate }: { id: string; selectedDate: string }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await api.get('/appointment/get-all-doctors', {
        headers,
        params: { id, selectedDate },
      });
      return response.data.data || MOCK_DOCTOR_DETAILS;
    } catch (error: any) {
      return MOCK_DOCTOR_DETAILS;
    }
  }
);

// Slice
const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    clearDoctorError: (state) => {
      state.error = null;
    },
    clearDoctors: (state) => {
      state.doctors = [];
    },
    clearDoctorDetails: (state) => {
      state.doctorDetails = MOCK_DOCTOR_DETAILS;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllDoctors.fulfilled, (state, action) => {
        state.doctors = action.payload;
        state.error = null;
      })
      .addCase(fetchAllDoctors.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchDoctorDetails.fulfilled, (state, action) => {
        state.doctorDetails = action.payload || MOCK_DOCTOR_DETAILS;
        state.error = null;
      })
      .addCase(fetchDoctorDetails.rejected, (state) => {
        state.doctorDetails = MOCK_DOCTOR_DETAILS;
        state.error = null;
      });
  },
});

export const { clearDoctorError, clearDoctors, clearDoctorDetails } = doctorSlice.actions;
export default doctorSlice.reducer;
