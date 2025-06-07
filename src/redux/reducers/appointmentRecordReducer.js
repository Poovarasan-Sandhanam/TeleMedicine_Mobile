import {
    FETCH_APPOINTMENTS_REQUEST,
    FETCH_APPOINTMENTS_SUCCESS,
    FETCH_APPOINTMENTS_FAILURE,
} from '../actions/: appointmentRecordActions'; // Fixed path

const initialState = {
    loading: false,
    appointmentRec: [],
    error: '',
};

const appointmentReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_APPOINTMENTS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case FETCH_APPOINTMENTS_SUCCESS:
            return {
                ...state,
                loading: false,
                appointmentRec: action.payload || [], // Fallback to empty array
                error: '',
            };
        case FETCH_APPOINTMENTS_FAILURE:
            return {
                ...state,
                loading: false,
                appointmentRec: [],
                error: action.payload,
            };
        default:
            return state;
    }
};

export default appointmentReducer;
