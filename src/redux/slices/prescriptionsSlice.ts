import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utilis/api';

// Types
interface PrescriptionsState {
  loading: boolean;
  data: any[];
  error: string | null;
}

const initialState: PrescriptionsState = {
  loading: false,
  data: [],
  error: null,
};

// Async thunks
export const getPrescriptions = createAsyncThunk(
  'prescriptions/getPrescriptions',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token is missing');
      }

      const headers = { Authorization: `Bearer ${token}` };
      const response = await api.get('/prescription/get-prescription', { headers });

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response ? error.response.data.message : error.message);
    }
  }
);

// Slice
const prescriptionsSlice = createSlice({
  name: 'prescriptions',
  initialState,
  reducers: {
    clearPrescriptionsError: (state) => {
      state.error = null;
    },
    clearPrescriptionsData: (state) => {
      state.data = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPrescriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPrescriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload || [];
        state.error = null;
      })
      .addCase(getPrescriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPrescriptionsError, clearPrescriptionsData } = prescriptionsSlice.actions;
export default prescriptionsSlice.reducer;
