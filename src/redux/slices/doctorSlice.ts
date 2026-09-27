import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utilis/api';

interface DoctorState {
  doctors: any[];
  doctorDetails: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: DoctorState = {
  doctors: [],
  doctorDetails: null,
  loading: false,
  error: null,
};

export const fetchAllDoctors = createAsyncThunk<any[], void, { rejectValue: string }>(
  'doctor/fetchAllDoctors',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await api.get('/appointment/get-all-doctors', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data?.data ?? [];
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Could not load doctors');
    }
  }
);

/** Bookable slots for one doctor on one day. `selectedDate` is YYYY-MM-DD. */
export const fetchDoctorDetails = createAsyncThunk<
  any,
  { id: string; selectedDate: string },
  { rejectValue: string }
>('doctor/fetchDoctorDetails', async ({ id, selectedDate }, { rejectWithValue }) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await api.get('/appointment/get-all-doctors', {
      headers: { Authorization: `Bearer ${token}` },
      params: { id, selectedDate },
    });
    return response.data?.data ?? { slots: [] };
  } catch (error: any) {
    return rejectWithValue(error?.message || 'Could not load available slots');
  }
});

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
      .addCase(fetchAllDoctors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDoctors.fulfilled, (state, action) => {
        state.loading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchAllDoctors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Could not load doctors';
      })
      .addCase(fetchDoctorDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        // Clear the previous doctor's or day's slots so they are never shown as current.
        state.doctorDetails = null;
      })
      .addCase(fetchDoctorDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorDetails = action.payload;
      })
      .addCase(fetchDoctorDetails.rejected, (state, action) => {
        state.loading = false;
        state.doctorDetails = null;
        state.error = action.payload ?? 'Could not load available slots';
      });
  },
});

export const { clearDoctorError, clearDoctors, clearDoctorDetails } = doctorSlice.actions;
export default doctorSlice.reducer;
