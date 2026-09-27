import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utilis/api';

export interface DoctorType {
  _id: string;
  id: string;
  title: string;
  image: string;
  /** The exact specialty name a doctor profile stores, e.g. "General Practitioner (GP)". */
  specialization?: string;
}

interface DoctorTypeState {
  doctorTypes: DoctorType[];
  loading: boolean;
  error: string | null;
}

const initialState: DoctorTypeState = {
  doctorTypes: [],
  loading: false,
  error: null,
};

export const fetchDoctorTypes = createAsyncThunk<DoctorType[], void, { rejectValue: string }>(
  'doctorType/fetchDoctorTypes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/doctor/getDoctorTypes');
      return (response.data?.data ?? []) as DoctorType[];
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Could not load specialities');
    }
  }
);

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
        state.doctorTypes = action.payload;
      })
      .addCase(fetchDoctorTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Could not load specialities';
      });
  },
});

export const { clearDoctorTypeError, clearDoctorTypes } = doctorTypeSlice.actions;
export default doctorTypeSlice.reducer;
