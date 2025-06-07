import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utilis/api';

// Action Types
export const FETCH_APPOINTMENTS_REQUEST = 'FETCH_APPOINTMENTS_REQUEST';
export const FETCH_APPOINTMENTS_SUCCESS = 'FETCH_APPOINTMENTS_SUCCESS';
export const FETCH_APPOINTMENTS_FAILURE = 'FETCH_APPOINTMENTS_FAILURE';

// Action Creators
export const fetchAppointmentsRequest = () => ({
    type: FETCH_APPOINTMENTS_REQUEST,
});

export const fetchAppointmentsSuccess = (appointments) => ({
    type: FETCH_APPOINTMENTS_SUCCESS,
    payload: appointments,
});

export const fetchAppointmentsFailure = (error) => ({
    type: FETCH_APPOINTMENTS_FAILURE,
    payload: error,
});

// Thunk to Fetch Appointments
export const fetchAppointments = (date) => async (dispatch) => {
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
    } catch (error) {
        console.error(error, "Fetch Appointments Error");
        dispatch(fetchAppointmentsFailure(error.response?.data?.message || error.message));
    }
};
