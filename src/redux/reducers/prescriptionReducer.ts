import {
  ADD_PRESCRIPTION_REQUEST,
  ADD_PRESCRIPTION_SUCCESS,
  ADD_PRESCRIPTION_FAILURE,
  PrescriptionActionTypes,
} from '../actions/prescriptionActions';

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

export const prescriptionReducer = (state: PrescriptionState = initialState, action: PrescriptionActionTypes): PrescriptionState => {
  switch (action.type) {
    case ADD_PRESCRIPTION_REQUEST:
      return { ...state, loading: true, error: null };
    case ADD_PRESCRIPTION_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case ADD_PRESCRIPTION_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}; 