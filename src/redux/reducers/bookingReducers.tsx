// reducers/bookingReducer.js
import {
    FETCH_BOOKINGS_REQUEST,
    FETCH_BOOKINGS_SUCCESS,
    FETCH_BOOKINGS_FAILURE,
  } from '../actions/bookingActions';
  
  const initialState = {
    loading: false,
    bookings: [],
    error: null,
  };
  
  export const bookingReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_BOOKINGS_REQUEST:
        return { ...state, loading: true, error: null };
      case FETCH_BOOKINGS_SUCCESS:
        return { ...state, loading: false, bookings: action.payload };
      case FETCH_BOOKINGS_FAILURE:
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  