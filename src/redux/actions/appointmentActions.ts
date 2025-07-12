import { Dispatch } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utilis/api';

// Action Types
export const BOOK_APPOINTMENT = 'BOOK_APPOINTMENT';
export const SET_APPOINTMENT_LOADING = 'SET_APPOINTMENT_LOADING';
export const SET_APPOINTMENT_ERROR = 'SET_APPOINTMENT_ERROR';

// Action Interfaces
interface BookAppointmentAction {
  type: typeof BOOK_APPOINTMENT;
  payload: any;
}

interface SetAppointmentLoadingAction {
  type: typeof SET_APPOINTMENT_LOADING;
  payload: boolean;
}

interface SetAppointmentErrorAction {
  type: typeof SET_APPOINTMENT_ERROR;
  payload: string | null;
}

export type AppointmentActionTypes = 
  | BookAppointmentAction
  | SetAppointmentLoadingAction
  | SetAppointmentErrorAction;

// Appointment Data Interface
interface AppointmentData {
  doctorId: string;
  date: string;
  time: string;
  notes?: string;
  patientId?: string;
}

// Set Loading State
const setAppointmentLoading = (loading: boolean): SetAppointmentLoadingAction => ({
  type: SET_APPOINTMENT_LOADING,
  payload: loading,
});

// Set Error State
const setAppointmentError = (error: string | null): SetAppointmentErrorAction => ({
  type: SET_APPOINTMENT_ERROR,
  payload: error,
});

// Book Appointment Action
export const bookAppointment = (appointmentData: AppointmentData) => async (dispatch: Dispatch<AppointmentActionTypes>) => {
  console.log(appointmentData, "bookAppointment------ooo");
  dispatch(setAppointmentLoading(true));
  dispatch(setAppointmentError(null)); // Clear previous errors

  try {
    const token = await AsyncStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const response = await api.post('/appointment/booking', appointmentData, { headers });
    console.log('Appointment Booking Successful:', response.data);

    // Dispatch booking success
    dispatch({
      type: BOOK_APPOINTMENT,
      payload: response.data,
    });

    return Promise.resolve(response.data); // Resolve the promise with the response
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Failed to book appointment.';
    console.error('Appointment Booking Error:', errorMessage);

    // Dispatch error
    dispatch(setAppointmentError(errorMessage));
    return Promise.reject(errorMessage); // Reject the promise with the error
  } finally {
    dispatch(setAppointmentLoading(false));
  }
}; 