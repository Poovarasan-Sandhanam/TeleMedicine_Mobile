import api from '../../utilis/api'; // your axios instance

// Action Types
export const GET_DOCTOR_TYPES = 'GET_DOCTOR_TYPES';
export const GET_DOCTORS = 'GET_DOCTORS';
export const GET_AVAILABLE_SLOTS = 'GET_AVAILABLE_SLOTS';
export const BOOK_APPOINTMENT = 'BOOK_APPOINTMENT';
export const SET_LOADING = 'SET_LOADING';
export const SET_ERROR = 'SET_ERROR';

// Action to set loading state
const setLoading = (loading) => ({
  type: SET_LOADING,
  payload: loading,
});

// Action to set error state
const setError = (error) => ({
  type: SET_ERROR,
  payload: error,
});

// Fetch doctor types
export const fetchDoctorTypes = () => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null)); // clear previous errors
  try {
    const response = await api.get('/doctors/types');
    const { data } = response;
    dispatch({ type: GET_DOCTOR_TYPES, payload: data });
  } catch (error) {
    dispatch(setError(error.message || 'Failed to fetch doctor types.'));
  } finally {
    dispatch(setLoading(false));
  }
};

// Fetch doctors based on selected type
export const fetchDoctors = (type) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null)); // clear previous errors
  try {
    const response = await api.get(`/doctors?type=${type}`);
    const { data } = response;
    dispatch({ type: GET_DOCTORS, payload: data });
  } catch (error) {
    dispatch(setError(error.message || 'Failed to fetch doctors.'));
  } finally {
    dispatch(setLoading(false));
  }
};

// Fetch available time slots for a doctor
export const fetchAvailableSlots = (doctorId) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null)); // clear previous errors
  try {
    const response = await api.get(`/doctors/${doctorId}/schedule?date=${new Date().toISOString().split('T')[0]}`);
    const { data } = response;
    dispatch({ type: GET_AVAILABLE_SLOTS, payload: data.availableSlots });
  } catch (error) {
    dispatch(setError(error.message || 'Failed to fetch available slots.'));
  } finally {
    dispatch(setLoading(false));
  }
};

// Book an appointment
export const bookAppointment = (appointmentDetails) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null)); // clear previous errors
  try {
    const response = await api.post('/appointments', appointmentDetails);
    const { data } = response;
    dispatch({ type: BOOK_APPOINTMENT, payload: data });
  } catch (error) {
    dispatch(setError(error.message || 'Failed to book appointment.'));
  } finally {
    dispatch(setLoading(false));
  }
};
