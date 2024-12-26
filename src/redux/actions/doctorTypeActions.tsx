import api from '../../utilis/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Action types
export const FETCH_DOCTOR_TYPES_REQUEST = 'FETCH_DOCTOR_TYPES_REQUEST';
export const FETCH_DOCTOR_TYPES_SUCCESS = 'FETCH_DOCTOR_TYPES_SUCCESS';
export const FETCH_DOCTOR_TYPES_FAILURE = 'FETCH_DOCTOR_TYPES_FAILURE';

// Fetch doctor types
export const fetchDoctorTypes = () => async (dispatch) => {
  dispatch({ type: FETCH_DOCTOR_TYPES_REQUEST });
  try {
    const token = await AsyncStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const response = await api.get('/profile/get-doctor-types', { headers });
    console.log("Doctor-type",response.data.data);

    if (response?.data?.data) {
      dispatch({
        type: FETCH_DOCTOR_TYPES_SUCCESS,
        payload: response.data.data,
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
