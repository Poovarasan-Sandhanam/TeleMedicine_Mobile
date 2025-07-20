import { createSlice } from '@reduxjs/toolkit';

// Types
interface SymptomState {
  symptoms: any[];
  loading: boolean;
  error: string | null;
}

const initialState: SymptomState = {
  symptoms: [],
  loading: false,
  error: null,
};

// Slice
const symptomSlice = createSlice({
  name: 'symptom',
  initialState,
  reducers: {
    setSymptoms: (state, action) => {
      state.symptoms = action.payload;
    },
    addSymptom: (state, action) => {
      state.symptoms.push(action.payload);
    },
    removeSymptom: (state, action) => {
      state.symptoms = state.symptoms.filter(symptom => symptom.id !== action.payload);
    },
    clearSymptoms: (state) => {
      state.symptoms = [];
    },
    setSymptomLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSymptomError: (state, action) => {
      state.error = action.payload;
    },
    clearSymptomError: (state) => {
      state.error = null;
    },
  },
});

export const { 
  setSymptoms, 
  addSymptom, 
  removeSymptom, 
  clearSymptoms, 
  setSymptomLoading, 
  setSymptomError, 
  clearSymptomError 
} = symptomSlice.actions;
export default symptomSlice.reducer; 