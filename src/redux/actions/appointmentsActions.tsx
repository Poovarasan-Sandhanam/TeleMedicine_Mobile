import api from '../../utilis/api';
// Action Types
export const BOOK_APPOINTMENT_SUCCESS = 'BOOK_APPOINTMENT_SUCCESS';
export const BOOK_APPOINTMENT_FAILURE = 'BOOK_APPOINTMENT_FAILURE';

// Action to book an appointment
export const bookAppointment = (appointmentData) => async (dispatch) => {
    try {
        const response = await api.post('/appointment/booking', appointmentData);
        dispatch({ type: BOOK_APPOINTMENT_SUCCESS, payload: response.data });
    } catch (error) {
        dispatch({ type: BOOK_APPOINTMENT_FAILURE, payload: error.message });
    }
};
