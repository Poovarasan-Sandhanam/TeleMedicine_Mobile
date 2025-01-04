import {
  BOOK_APPOINTMENT_SUCCESS,
  BOOK_APPOINTMENT_ERROR,
} from '../actions/appointmentsActions';

const initialState = {
  appointment: null,
  error: null,
};

const appointmentReducer = (state = initialState, action) => {
  switch (action.type) {
      case BOOK_APPOINTMENT_SUCCESS:
          return { ...state, appointment: action.payload, error: null };
      case BOOK_APPOINTMENT_ERROR:
          return { ...state, error: action.payload };
      default:
          return state;
  }
};

export default appointmentReducer;
