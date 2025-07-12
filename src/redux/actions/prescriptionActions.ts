import { Dispatch } from 'redux';
import api from '../../utilis/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Action Types
export const ADD_PRESCRIPTION_REQUEST = 'ADD_PRESCRIPTION_REQUEST';
export const ADD_PRESCRIPTION_SUCCESS = 'ADD_PRESCRIPTION_SUCCESS';
export const ADD_PRESCRIPTION_FAILURE = 'ADD_PRESCRIPTION_FAILURE';

// Action Interfaces
interface AddPrescriptionRequestAction {
  type: typeof ADD_PRESCRIPTION_REQUEST;
}

interface AddPrescriptionSuccessAction {
  type: typeof ADD_PRESCRIPTION_SUCCESS;
  payload: any;
}

interface AddPrescriptionFailureAction {
  type: typeof ADD_PRESCRIPTION_FAILURE;
  payload: string;
}

export type PrescriptionActionTypes = 
  | AddPrescriptionRequestAction
  | AddPrescriptionSuccessAction
  | AddPrescriptionFailureAction;

// Prescription Data Interface
interface PrescriptionData {
  patientId: string;
  diagnosis: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  notes?: string;
}

// Action Creator
export const addPrescription = (prescriptionData: PrescriptionData) => async (dispatch: Dispatch<PrescriptionActionTypes>) => {
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
  } catch (error: any) {
    dispatch({
      type: ADD_PRESCRIPTION_FAILURE,
      payload: error.response ? error.response.data.message : error.message,
    });
  }
}; 