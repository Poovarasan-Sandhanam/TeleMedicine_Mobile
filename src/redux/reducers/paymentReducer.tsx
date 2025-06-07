import {
  BOOK_NOW_REQUEST,
  BOOK_NOW_SUCCESS,
  BOOK_NOW_FAILURE,
} from '../actions/paymentActions';

const initialState = {
  loading: false,
  data: null,
  error: null,
};

export const paymentReducer = (state = initialState, action) => {
  switch (action.type) {
    case BOOK_NOW_REQUEST:
      return { ...state, loading: true, error: null };
    case BOOK_NOW_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case BOOK_NOW_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
