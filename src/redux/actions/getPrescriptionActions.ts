import { Dispatch } from 'redux';
import api from '../../utilis/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Action Types
export const GET_PRESCRIPTIONS_REQUEST = 'GET_PRESCRIPTIONS_REQUEST';
export const GET_PRESCRIPTIONS_SUCCESS = 'GET_PRESCRIPTIONS_SUCCESS';
export const GET_PRESCRIPTIONS_FAILURE = 'GET_PRESCRIPTIONS_FAILURE';

// Action Interfaces
interface GetPrescriptionsRequestAction {
  type: typeof GET_PRESCRIPTIONS_REQUEST;
}

interface GetPrescriptionsSuccessAction {
  type: typeof GET_PRESCRIPTIONS_SUCCESS;
  payload: any[];
}

interface GetPrescriptionsFailureAction {
  type: typeof GET_PRESCRIPTIONS_FAILURE;
  payload: string;
}

export type PrescriptionActionTypes = 
  | GetPrescriptionsRequestAction
  | GetPrescriptionsSuccessAction
  | GetPrescriptionsFailureAction;

// Action Creator for fetching prescriptions
export const getPrescriptions = () => async (dispatch: Dispatch<PrescriptionActionTypes>) => {
  dispatch({ type: GET_PRESCRIPTIONS_REQUEST });

  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication token is missing');
    }

    const headers = { Authorization: `Bearer ${token}` };

    const response = await api.get('/prescription/get-prescription', { headers });

    dispatch({ type: GET_PRESCRIPTIONS_SUCCESS, payload: response.data.data });
  } catch (error: any) {
    dispatch({
      type: GET_PRESCRIPTIONS_FAILURE,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
}; 