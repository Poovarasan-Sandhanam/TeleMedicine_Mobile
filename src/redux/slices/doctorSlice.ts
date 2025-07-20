import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utilis/api';

// Types
interface DoctorState {
  doctors: any[];
  doctorDetails: any | null;
  error: string | null;
}

const initialState: DoctorState = {
  doctors: [],
  doctorDetails: null,
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
        params: { id, selectedDate }
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
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
      state.doctorDetails = null;
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
        state.doctorDetails = action.payload;
        state.error = null;
      })
      .addCase(fetchDoctorDetails.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearDoctorError, clearDoctors, clearDoctorDetails } = doctorSlice.actions;
export default doctorSlice.reducer; 