import AsyncStorage from '@react-native-async-storage/async-storage';

export const FETCH_BOOKINGS_REQUEST = "FETCH_BOOKINGS_REQUEST";
export const FETCH_BOOKINGS_SUCCESS = "FETCH_BOOKINGS_SUCCESS";
export const FETCH_BOOKINGS_FAILURE = "FETCH_BOOKINGS_FAILURE";

export const fetchBookings = () => async (dispatch) => {
  dispatch({ type: FETCH_BOOKINGS_REQUEST });

  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token is missing. Please log in again.');
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch('http://localhost:3001/api/v1/payment/get-bookings', {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch bookings.');
    }

    // Extract bookingDetails and dispatch
    const bookingDetails = data.data.bookingDetails || [];
    dispatch({ type: FETCH_BOOKINGS_SUCCESS, payload: bookingDetails });
  } catch (error) {
    dispatch({
      type: FETCH_BOOKINGS_FAILURE,
      payload: error.message || 'Something went wrong.',
    });
  }
};
