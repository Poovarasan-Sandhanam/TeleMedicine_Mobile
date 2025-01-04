import api from '../../utilis/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Action Types
export const FETCH_DOCTORS_SUCCESS = 'FETCH_DOCTORS_SUCCESS';
export const FETCH_DOCTORS_ERROR = 'FETCH_DOCTORS_ERROR';
export const FETCH_DOCTOR_DETAILS_SUCCESS = 'FETCH_DOCTOR_DETAILS_SUCCESS';
export const FETCH_DOCTOR_DETAILS_ERROR = 'FETCH_DOCTOR_DETAILS_ERROR';

// Action to fetch all doctors
export const fetchAllDoctors = () => async (dispatch) => {
    try {

        const token = await AsyncStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const response = await api.get('/appointment/get-all-doctors', { headers });
        
        dispatch({ type: FETCH_DOCTORS_SUCCESS, payload: response.data.data });
    } catch (error) {
        dispatch({ type: FETCH_DOCTORS_ERROR, payload: error.message });
    }
};

// Action to fetch doctor details
export const fetchDoctorDetails = (id, selectedDate) => async (dispatch) => {
    try {
        const token = await AsyncStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const response = await api.get('/appointment/get-all-doctors', {headers,
            params: { id, selectedDate }
        });
        dispatch({ type: FETCH_DOCTOR_DETAILS_SUCCESS, payload: response.data.data });
    } catch (error) {
        dispatch({ type: FETCH_DOCTOR_DETAILS_ERROR, payload: error.message });
    }
};
