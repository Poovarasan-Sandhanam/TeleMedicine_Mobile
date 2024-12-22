import {
    GET_DOCTOR_TYPES,
    GET_DOCTORS,
    GET_AVAILABLE_SLOTS,
    BOOK_APPOINTMENT,
    SET_LOADING,
    SET_ERROR,
  } from '../actions/appointmentsActions';
  
  const initialState = {
    doctorTypes: [],
    doctors: [],
    availableSlots: [],
    selectedDoctor: null,
    selectedSlot: null,
    patientName: '',
    loading: false,
    error: null,
  };
  
  const appointmentReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_DOCTOR_TYPES:
        return { ...state, doctorTypes: action.payload };
      case GET_DOCTORS:
        return { ...state, doctors: action.payload };
      case GET_AVAILABLE_SLOTS:
        return { ...state, availableSlots: action.payload };
      case BOOK_APPOINTMENT:
        return {
          ...state,
          selectedDoctor: null,
          availableSlots: [],
          patientName: '',
          selectedSlot: null,
        };
      case SET_LOADING:
        return { ...state, loading: action.payload };
      case SET_ERROR:
        return { ...state, error: action.payload };
      default:
        return state;
    }
  };
  
  export default appointmentReducer;
  