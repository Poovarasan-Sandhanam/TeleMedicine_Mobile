import api from '../../utilis/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FETCH_PROFILE_SUCCESS = 'FETCH_PROFILE_SUCCESS';
export const UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS';
export const PROFILE_ERROR = 'PROFILE_ERROR';

export const fetchProfile = () => async (dispatch) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const response = await api.get('/profile/get-profile', { headers });

    dispatch({
      type: FETCH_PROFILE_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    dispatch({ type: PROFILE_ERROR, payload: error.message });
  }
};

export const updateProfile = (formData) => async (dispatch) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    };
    const response = await api.post('/profile/update-profile', formData, { headers });

    dispatch({
      type: UPDATE_PROFILE_SUCCESS,
      payload: response.data.data,
    });

    // Fetch the updated profile after successful update
    dispatch(fetchProfile());

    return response.data;
  } catch (error) {
    dispatch({ type: PROFILE_ERROR, payload: error.message });
  }
};

