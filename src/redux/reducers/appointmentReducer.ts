import { 
  BOOK_APPOINTMENT, 
  SET_APPOINTMENT_LOADING, 
  SET_APPOINTMENT_ERROR,
  AppointmentActionTypes 
} from '../actions/appointmentActions';

interface AppointmentState {
  appointment: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: AppointmentState = {
  appointment: null,
  loading: false,
  error: null,
};

const appointmentReducer = (state: AppointmentState = initialState, action: AppointmentActionTypes): AppointmentState => {
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