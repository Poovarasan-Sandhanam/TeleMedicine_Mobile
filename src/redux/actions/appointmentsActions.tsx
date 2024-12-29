import api from '../../utilis/api';

// Action types
export const BOOK_APPOINTMENT_REQUEST = 'BOOK_APPOINTMENT_REQUEST';
export const BOOK_APPOINTMENT_SUCCESS = 'BOOK_APPOINTMENT_SUCCESS';
export const BOOK_APPOINTMENT_FAILURE = 'BOOK_APPOINTMENT_FAILURE';

// Action creator
export const bookAppointment = (appointmentData) => async (dispatch) => {
    dispatch({ type: BOOK_APPOINTMENT_REQUEST });
    try {
        const response = await api.post('/appointment/booking', appointmentData);
        dispatch({
            type: BOOK_APPOINTMENT_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: BOOK_APPOINTMENT_FAILURE,
            payload: error.response ? error.response.data.message : error.message,
        });
    }
};
