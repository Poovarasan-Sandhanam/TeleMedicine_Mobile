import { Dispatch } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utilis/api';

// Action Types
export const FETCH_APPOINTMENTS_REQUEST = 'FETCH_APPOINTMENTS_REQUEST';
export const FETCH_APPOINTMENTS_SUCCESS = 'FETCH_APPOINTMENTS_SUCCESS';
export const FETCH_APPOINTMENTS_FAILURE = 'FETCH_APPOINTMENTS_FAILURE';

// Action Interfaces
interface FetchAppointmentsRequestAction {
  type: typeof FETCH_APPOINTMENTS_REQUEST;
}

interface FetchAppointmentsSuccessAction {
  type: typeof FETCH_APPOINTMENTS_SUCCESS;
  payload: any[];
}

interface FetchAppointmentsFailureAction {
  type: typeof FETCH_APPOINTMENTS_FAILURE;
  payload: string;
}

export type AppointmentRecordActionTypes = 
  | FetchAppointmentsRequestAction
  | FetchAppointmentsSuccessAction
  | FetchAppointmentsFailureAction;

// Action Creators
export const fetchAppointmentsRequest = (): FetchAppointmentsRequestAction => ({
  type: FETCH_APPOINTMENTS_REQUEST,
});

export const fetchAppointmentsSuccess = (appointments: any[]): FetchAppointmentsSuccessAction => ({
  type: FETCH_APPOINTMENTS_SUCCESS,
  payload: appointments,
});

export const fetchAppointmentsFailure = (error: string): FetchAppointmentsFailureAction => ({
  type: FETCH_APPOINTMENTS_FAILURE,
  payload: error,
});

// Thunk to Fetch Appointments
export const fetchAppointments = (date: string) => async (dispatch: Dispatch<AppointmentRecordActionTypes>) => {
  dispatch(fetchAppointmentsRequest());
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) throw new Error('Authentication token is missing.');

    const headers = { Authorization: `Bearer ${token}` };
    const response = await api.get('/appointment/get-all-appointments', {
      headers,
      params: { date },
    });

    console.log(response.data.data, "API Response");
    dispatch(fetchAppointmentsSuccess(response.data.data));
  } catch (error: any) {
    console.error(error, "Fetch Appointments Error");
    dispatch(fetchAppointmentsFailure(error.response?.data?.message || error.message));
  }
}; 