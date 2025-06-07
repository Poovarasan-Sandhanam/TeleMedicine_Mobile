import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utilis/api'; // Ensure you have an API utility to make HTTP requests

// Action Types
export const BOOK_NOW_REQUEST = 'BOOK_NOW_REQUEST';
export const BOOK_NOW_SUCCESS = 'BOOK_NOW_SUCCESS';
export const BOOK_NOW_FAILURE = 'BOOK_NOW_FAILURE';

// Action Creator
export const bookNow = (appointmentId) => async (dispatch) => {
  dispatch({ type: BOOK_NOW_REQUEST });

  try {
    // Retrieve the token from AsyncStorage
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token is missing');
    }

    // Prepare headers
    const headers = { Authorization: `Bearer ${token}` };

    // Make the POST API call
    const response = await api.post(
      '/payment/book-now',
      { appointmentId },
      { headers }
    );

    // Dispatch success action with response data
    dispatch({ type: BOOK_NOW_SUCCESS, payload: response.data });
  } catch (error) {
    // Dispatch failure action with error message
    dispatch({
      type: BOOK_NOW_FAILURE,
      payload: error.response ? error.response.data : error.message,
    });
  }
};
