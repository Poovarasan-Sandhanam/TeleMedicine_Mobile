import api from '../../utilis/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Action Types
export const ADD_PRESCRIPTION_REQUEST = 'ADD_PRESCRIPTION_REQUEST';
export const ADD_PRESCRIPTION_SUCCESS = 'ADD_PRESCRIPTION_SUCCESS';
export const ADD_PRESCRIPTION_FAILURE = 'ADD_PRESCRIPTION_FAILURE';

// Action Creator
export const addPrescription = (prescriptionData) => async (dispatch) => {
  dispatch({ type: ADD_PRESCRIPTION_REQUEST });

  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token is missing');
    }

    const headers = { Authorization: `Bearer ${token}` };

    const response = await api.post(
      '/prescription/add-prescription',
      prescriptionData,
      { headers }
    );

    dispatch({ type: ADD_PRESCRIPTION_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({
      type: ADD_PRESCRIPTION_FAILURE,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
};
