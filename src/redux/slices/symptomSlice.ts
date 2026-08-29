
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utilis/api';

export const checkSymptoms = createAsyncThunk(
  'symptom/checkSymptoms',
  async (symptoms: string, thunkAPI) => {
    try {
      const response = await api.post('/ai/symptom-check', { symptoms });
      return response.data;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || 'Unexpected error';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

interface SymptomState {
  symptoms: string;
  possibleConditions: string[];
  recommendedDoctor: string;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SymptomState = {
  symptoms: '',
  possibleConditions: [],
  recommendedDoctor: '',
  status: 'idle',
  error: null,
};

const symptomSlice = createSlice({
  name: 'symptom',
  initialState,
  reducers: {
    setSymptoms(state, action) {
      state.symptoms = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkSymptoms.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(checkSymptoms.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.possibleConditions = action.payload.possible_conditions || [];
        state.recommendedDoctor = action.payload.recommended_doctor || '';
      })
      .addCase(checkSymptoms.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to fetch conditions';
      });
  },
});

export const { setSymptoms } = symptomSlice.actions;
export default symptomSlice.reducer;
