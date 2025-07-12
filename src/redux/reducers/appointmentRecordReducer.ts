import {
  FETCH_APPOINTMENTS_REQUEST,
  FETCH_APPOINTMENTS_SUCCESS,
  FETCH_APPOINTMENTS_FAILURE,
  AppointmentRecordActionTypes,
} from '../actions/appointmentRecordActions';

interface AppointmentRecordState {
  loading: boolean;
  appointmentRec: any[];
  error: string;
}

const initialState: AppointmentRecordState = {
  loading: false,
  appointmentRec: [],
  error: '',
};

const appointmentReducer = (state: AppointmentRecordState = initialState, action: AppointmentRecordActionTypes): AppointmentRecordState => {
  switch (action.type) {
    case FETCH_APPOINTMENTS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_APPOINTMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        appointmentRec: action.payload || [], // Fallback to empty array
        error: '',
      };
    case FETCH_APPOINTMENTS_FAILURE:
      return {
        ...state,
        loading: false,
        appointmentRec: [],
        error: action.payload,
      };
    default:
      return state;
  }
};

export default appointmentReducer; 