import { LOGIN, LOGOUT, SIGNUP, SET_ERROR, SET_LOADING } from '../actions/authActions';

const initialState = {
  user: null,
  error: null,
  loading: false,
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
    case SIGNUP:
      return {
        ...state,
        user: action.payload,
        error: null, // Clear errors on success
        loading: false, // Ensure loading is false on success
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        error: null, // Clear errors on logout
        loading: false,
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false, // Ensure loading is false when an error occurs
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
