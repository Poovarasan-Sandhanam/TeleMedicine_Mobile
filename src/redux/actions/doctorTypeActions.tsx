import api from '../../utilis/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Action types
export const FETCH_DOCTOR_TYPES_REQUEST = 'FETCH_DOCTOR_TYPES_REQUEST';
export const FETCH_DOCTOR_TYPES_SUCCESS = 'FETCH_DOCTOR_TYPES_SUCCESS';
export const FETCH_DOCTOR_TYPES_FAILURE = 'FETCH_DOCTOR_TYPES_FAILURE';

// Fetch doctor types action
export const fetchDoctorTypes = () => async (dispatch) => {
  dispatch({ type: FETCH_DOCTOR_TYPES_REQUEST });
  try {
    const token = await AsyncStorage.getItem('token'); // Get token from async storage
    const headers = { Authorization: `Bearer ${token}` }; // Set Authorization header
    const response = await api.get('/profile/get-doctor-types', { headers }); // API call

    if (response?.data?.data) {
      dispatch({
        type: FETCH_DOCTOR_TYPES_SUCCESS,
        payload: response.data.data, // Dispatch success action with the data
      });
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error) {
    dispatch({
      type: FETCH_DOCTOR_TYPES_FAILURE,
      payload: error.message || 'Failed to fetch doctor types',
    });
  }
};
