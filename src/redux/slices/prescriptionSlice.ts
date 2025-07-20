import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utilis/api';

// Types
interface PrescriptionData {
  patientId: string;
  diagnosis: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  notes?: string;
}

interface PrescriptionState {
  loading: boolean;
  data: any | null;
  error: string | null;
}

const initialState: PrescriptionState = {
  loading: false,
  data: null,
  error: null,
};

// Async thunks
export const addPrescription = createAsyncThunk(
  'prescription/addPrescription',
  async (prescriptionData: PrescriptionData, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token is missing');
      }

      const headers = { Authorization: `Bearer ${token}` };
      const response = await api.post(
        '/prescription/add-prescription',
        prescriptionData,
        { headers }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response ? error.response.data.message : error.message);
    }
  }
);

// Slice
const prescriptionSlice = createSlice({
  name: 'prescription',
  initialState,
  reducers: {
    clearPrescriptionError: (state) => {
      state.error = null;
    },
    clearPrescriptionData: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addPrescription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPrescription.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(addPrescription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPrescriptionError, clearPrescriptionData } = prescriptionSlice.actions;
export default prescriptionSlice.reducer; 