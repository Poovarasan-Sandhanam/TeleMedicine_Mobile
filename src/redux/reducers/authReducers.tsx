import { LOGIN, LOGOUT, SIGNUP, SET_ERROR, SET_LOADING } from '../actions/authActions';

const initialState = {
  user: null,
  token: null,
  isDoctor: null,
  loading: false,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case LOGIN:
      return {
        ...state,
        user: action.payload,
        token: action.payload.token,
        isDoctor: action.payload.isDoctor,
        error: null, // Clear any existing errors
      };
    case SIGNUP:
      return {
        ...state,
        // You might add logic here to handle additional signup state changes, if necessary
        error: null,
      };
    case LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isDoctor: null,
      };
    default:
      return state;
  }
};

export default authReducer;
