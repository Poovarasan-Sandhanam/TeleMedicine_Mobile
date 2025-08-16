import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utilis/api';

// Types
interface DoctorType {
  _id: string;
  id: string;
  title: string;
  image: string;
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

// Async thunk to fetch doctor types from API
export const fetchDoctorTypes = createAsyncThunk<
  DoctorType[],
  void,
  { rejectValue: string }
>('doctorType/fetchDoctorTypes', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/doctor/getDoctorTypes');
    console.log(response.data.data,"response");
  
   if (response?.data?.status && response?.data?.data) {
      return response.data.data as DoctorType[];
    } else {
      throw new Error(response?.data?.message || 'Failed to fetch doctor types');
    }
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch doctor types');
  }
});

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
        state.doctorTypes = action.payload;
        state.error = null;
      })
      .addCase(fetchDoctorTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      });
  },
});

export const { clearDoctorTypeError, clearDoctorTypes } = doctorTypeSlice.actions;
export default doctorTypeSlice.reducer;
