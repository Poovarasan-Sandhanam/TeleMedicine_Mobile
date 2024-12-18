import { LOGIN, LOGOUT, SET_ERROR, SET_LOADING } from '../actions/authActions';

const initialState = {
  user: null,
  error: null,
  loading: false,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        user: action.payload, // Updated user structure
        error: null,
        loading: false,
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        error: null,
        loading: false,
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
}
