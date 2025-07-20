import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utilis/api';

// Types
interface DoctorTypeState {
  doctorTypes: any[];
  loading: boolean;
  error: string | null;
}

const initialState: DoctorTypeState = {
  doctorTypes: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchDoctorTypes = createAsyncThunk(
  'doctorType/fetchDoctorTypes',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const response = await api.get('/profile/get-doctor-types', { headers });

      if (response?.data?.data) {
        return response.data.data;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch doctor types');
    }
  }
);

// Slice
const doctorTypeSlice = createSlice({
  name: 'doctorType',
  initialState,
  reducers: {
    clearDoctorTypeError: (state) => {
      state.error = null;
    },
    clearDoctorTypes: (state) => {
      state.doctorTypes = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorTypes = action.payload || [];
        state.error = null;
      })
      .addCase(fetchDoctorTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearDoctorTypeError, clearDoctorTypes } = doctorTypeSlice.actions;
export default doctorTypeSlice.reducer; 