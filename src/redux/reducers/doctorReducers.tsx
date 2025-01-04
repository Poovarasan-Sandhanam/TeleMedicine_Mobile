import {
    FETCH_DOCTORS_SUCCESS,
    FETCH_DOCTORS_ERROR,
    FETCH_DOCTOR_DETAILS_SUCCESS,
    FETCH_DOCTOR_DETAILS_ERROR,
} from '../actions/doctorActions';

const initialState = {
    doctors: [],
    doctorDetails: null,
    error: null,
};

const doctorReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_DOCTORS_SUCCESS:
            return { ...state, doctors: action.payload, error: null };
        case FETCH_DOCTORS_ERROR:
            return { ...state, error: action.payload };
        case FETCH_DOCTOR_DETAILS_SUCCESS:
            return { ...state, doctorDetails: action.payload, error: null };
        case FETCH_DOCTOR_DETAILS_ERROR:
            return { ...state, error: action.payload };
        default:
            return state;
    }
};

export default doctorReducer;
