import {
    BOOK_APPOINTMENT_REQUEST,
    BOOK_APPOINTMENT_SUCCESS,
    BOOK_APPOINTMENT_FAILURE,
  } from '../actions/appointmentsActions';
  
  const initialState = {
    loading: false,
    appointment: null,
    error: null,
  };
  
  export const appointmentReducer = (state = initialState, action) => {
    switch (action.type) {
      case BOOK_APPOINTMENT_REQUEST:
        return {
          ...state,
          loading: true,
          error: null,
        };
      case BOOK_APPOINTMENT_SUCCESS:
        return {
          ...state,
          loading: false,
          appointment: action.payload, // Save the appointment data
          error: null,
        };
      case BOOK_APPOINTMENT_FAILURE:
        return {
          ...state,
          loading: false,
          appointment: null,
          error: action.payload, // Capture the error message
        };
      default:
        return state;
    }
  };
  