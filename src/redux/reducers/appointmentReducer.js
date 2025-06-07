import { BOOK_APPOINTMENT, SET_APPOINTMENT_LOADING, SET_APPOINTMENT_ERROR } from '../actions/appointmentActions';

const initialState = {
  appointment: null,
  loading: false,
  error: null,
};

const appointmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_APPOINTMENT_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case SET_APPOINTMENT_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case BOOK_APPOINTMENT:
      return {
        ...state,
        appointment: action.payload,
        error: null, // Clear any existing errors
      };
    default:
      return state;
  }
};

export default appointmentReducer;
