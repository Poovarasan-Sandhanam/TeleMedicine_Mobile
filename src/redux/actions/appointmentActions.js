import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utilis/api';

// Action Types
export const BOOK_APPOINTMENT = 'BOOK_APPOINTMENT';
export const SET_APPOINTMENT_LOADING = 'SET_APPOINTMENT_LOADING';
export const SET_APPOINTMENT_ERROR = 'SET_APPOINTMENT_ERROR';

// Set Loading State
const setAppointmentLoading = (loading) => ({
  type: SET_APPOINTMENT_LOADING,
  payload: loading,
});

// Set Error State
const setAppointmentError = (error) => ({
  type: SET_APPOINTMENT_ERROR,
  payload: error,
});

// Book Appointment Action
export const bookAppointment = (appointmentData) => async (dispatch) => {
  console.log(appointmentData,"bookAppointment------ooo");
  dispatch(setAppointmentLoading(true));
  dispatch(setAppointmentError(null)); // Clear previous errors

  try {
    const token = await AsyncStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const response = await api.post('/appointment/booking', appointmentData,{ headers });
    console.log('Appointment Booking Successful:', response.data);

    // Dispatch booking success
    dispatch({
      type: BOOK_APPOINTMENT,
      payload: response.data,
    });

    return Promise.resolve(response.data); // Resolve the promise with the response
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to book appointment.';
    console.error('Appointment Booking Error:', errorMessage);

    // Dispatch error
    dispatch(setAppointmentError(errorMessage));
    return Promise.reject(errorMessage); // Reject the promise with the error
  } finally {
    dispatch(setAppointmentLoading(false));
  }
};
