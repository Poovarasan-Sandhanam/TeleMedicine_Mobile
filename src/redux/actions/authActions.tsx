import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utilis/api';

// Action Types
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const SIGNUP = 'SIGNUP';
export const SET_ERROR = 'SET_ERROR';
export const SET_LOADING = 'SET_LOADING';

// Set Loading State
const setLoading = (loading) => ({
  type: SET_LOADING,
  payload: loading,
});

// Set Error State
const setError = (error) => ({
  type: SET_ERROR,
  payload: error,
});

// Login Action
export const login = (email, password) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null)); // Clear previous errors

  try {
    const response = await api.post('/auth/login', { email, password });
    const { token, fullName, email: userEmail, isDoctor } = response.data.data;

    console.log('Login successful:', response.data);

    console.log("isDoctor",response.data.data.isDoctor);
    

    // Construct the user object to store in Redux and AsyncStorage
    const user = {
      email: userEmail,
      fullName,
      token,
      isDoctor,
    };

    // Store token and user data in AsyncStorage
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('isDoctor', JSON.stringify(isDoctor));
    await AsyncStorage.setItem('user', JSON.stringify(user));

    // Dispatch login success
    dispatch({ type: LOGIN, payload: user });
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Login failed.';
    console.log('Login Error:', errorMessage);
    dispatch(setError(errorMessage));
  } finally {
    dispatch(setLoading(false));
  }
};




export const signup = (data) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await api.post('/auth/register', data);
    console.log('Signup success:', response.data);
    dispatch({ type: SIGNUP, payload: response.data });
    return Promise.resolve(response.data); // Resolve promise on success
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
    console.error('Signup failed:', errorMessage);
    dispatch({ type: SET_ERROR, payload: errorMessage });
    return Promise.reject(errorMessage); // Reject promise on failure
  } finally {
    dispatch(setLoading(false));
  }
};


// Logout Action
export const logout = () => (dispatch) => {
  dispatch(setLoading(true));
  try {
    // Optionally make an API call here to invalidate tokens if necessary
    dispatch({ type: LOGOUT });
    console.log('User logged out successfully.');
  } catch (error) {
    const errorMessage = error.message || 'Logout failed.';
    dispatch(setError(errorMessage));
    console.error('Logout Error:', errorMessage);
  } finally {
    dispatch(setLoading(false));
  }
};




