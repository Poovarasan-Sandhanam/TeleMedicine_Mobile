import {
  GET_PRESCRIPTIONS_REQUEST,
  GET_PRESCRIPTIONS_SUCCESS,
  GET_PRESCRIPTIONS_FAILURE,
  PrescriptionActionTypes,
} from '../actions/getPrescriptionActions';

interface PrescriptionsState {
  loading: boolean;
  data: any[];
  error: string | null;
}

const initialState: PrescriptionsState = {
  loading: false,
  data: [], // Default to an empty array for consistency
  error: null,
};

export const prescriptionsReducer = (state: PrescriptionsState = initialState, action: PrescriptionActionTypes): PrescriptionsState => {
  switch (action.type) {
    case GET_PRESCRIPTIONS_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_PRESCRIPTIONS_SUCCESS:
      return { ...state, loading: false, data: action.payload || [] }; // Ensure data is updated
    case GET_PRESCRIPTIONS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}; 