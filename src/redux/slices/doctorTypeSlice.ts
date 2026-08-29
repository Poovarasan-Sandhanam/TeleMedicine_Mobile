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

const MOCK_DOCTOR_TYPES: DoctorType[] = [
  { id: '1', _id: '1', title: 'Cardiology', image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=400' },
  { id: '2', _id: '2', title: 'Dermatology', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400' },
  { id: '3', _id: '3', title: 'Pediatrics', image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=400' },
  { id: '4', _id: '4', title: 'Neurology', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400' },
  { id: '5', _id: '5', title: 'Orthopedics', image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400' },
  { id: '6', _id: '6', title: 'General Physician', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400' },
];

const initialState: DoctorTypeState = {
  doctorTypes: MOCK_DOCTOR_TYPES,
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
    if (response?.data?.status && response?.data?.data && response.data.data.length > 0) {
      return response.data.data as DoctorType[];
    }
    return MOCK_DOCTOR_TYPES;
  } catch (error: any) {
    return MOCK_DOCTOR_TYPES;
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
      state.doctorTypes = MOCK_DOCTOR_TYPES;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorTypes.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchDoctorTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.doctorTypes = action.payload.length > 0 ? action.payload : MOCK_DOCTOR_TYPES;
        state.error = null;
      })
      .addCase(fetchDoctorTypes.rejected, (state) => {
        state.loading = false;
        state.doctorTypes = MOCK_DOCTOR_TYPES;
        state.error = null;
      });
  },
});

export const { clearDoctorTypeError, clearDoctorTypes } = doctorTypeSlice.actions;
export default doctorTypeSlice.reducer;
