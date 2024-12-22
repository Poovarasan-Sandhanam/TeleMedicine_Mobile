import {
  FETCH_PROFILE_SUCCESS,
  UPDATE_PROFILE_SUCCESS,
  PROFILE_ERROR,
} from '../actions/profileActions';

const initialState = {
  profile: null,
  error: null,
};

const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROFILE_SUCCESS:
    case UPDATE_PROFILE_SUCCESS:
      return { ...state, profile: action.payload, error: null };

    case PROFILE_ERROR:
      return { ...state, error: action.payload };

    default:
      return state;
  }
};

export default profileReducer;
