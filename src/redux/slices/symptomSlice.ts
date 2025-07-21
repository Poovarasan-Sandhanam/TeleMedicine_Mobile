
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utilis/api';

export const checkSymptoms = createAsyncThunk(
  'symptom/checkSymptoms',
  async (symptoms, thunkAPI) => {
    try {
      const response = await api.post('/ai/symptom-check', { symptoms });
      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || 'Unexpected error';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const symptomSlice = createSlice({
  name: 'symptom',
  initialState: {
    symptoms: '',
    possibleConditions: [],
    recommendedDoctor: '',
    status: 'idle',
    error: null,
  },
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
        state.error = action.payload || 'Failed to fetch conditions';
      });
  },
});

export const { setSymptoms } = symptomSlice.actions;
export default symptomSlice.reducer;
