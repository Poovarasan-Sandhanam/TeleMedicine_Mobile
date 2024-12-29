import {
  FETCH_PROFILE_REQUEST,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAILURE,
  FETCH_DOCTOR_TYPES_REQUEST,
  FETCH_DOCTOR_TYPES_SUCCESS,
  FETCH_DOCTOR_TYPES_FAILURE,
} from '../actions/doctorTypeActions';

const initialState = {
  profile: null, // Profile data is null initially
  doctorTypes: [], // doctorTypes initialized as an empty array
  loading: false,
  error: null,
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROFILE_REQUEST:
      return { ...state, loading: true };
    case FETCH_PROFILE_SUCCESS:
      return { ...state, profile: action.payload, loading: false };
    case FETCH_PROFILE_FAILURE:
      return { ...state, error: action.payload, loading: false };

    case FETCH_DOCTOR_TYPES_REQUEST:
      return { ...state, loading: true }; // Set loading to true when fetching doctor types
    case FETCH_DOCTOR_TYPES_SUCCESS:
      return { 
        ...state, 
        doctorTypes: action.payload || [], // Ensure doctorTypes defaults to empty array if no data
        loading: false 
      };
    case FETCH_DOCTOR_TYPES_FAILURE:
      return { ...state, error: action.payload, loading: false };

    default:
      return state;
  }
};

export default profileReducer;
