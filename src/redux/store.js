// store.js
import { createStore, combineReducers, applyMiddleware } from "redux";
import {thunk} from "redux-thunk";
import authReducer from "./reducers/authReducers";
import profileReducer from "./reducers/profileReducers";
import doctorTypeReducer from "./reducers/doctorTypeReducers";
import doctorReducer from "./reducers/doctorReducers";
import appointmentReducer from "./reducers/appointmentReducer";
import appointmentRecordReducer from "./reducers/appointmentRecordReducer"
import {paymentReducer} from "./reducers/paymentReducer"
import { bookingReducer } from './reducers/bookingReducers';
import { prescriptionReducer } from './reducers/prescriptionReducer';
import { prescriptionsReducer } from './reducers/getPrescriptionReducers';


const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  doctorTypes: doctorTypeReducer,
  doctors: doctorReducer,
  appointment:appointmentReducer,
  appointmentRec:appointmentRecordReducer,
  payment:paymentReducer,
  bookings: bookingReducer,
  prescription: prescriptionReducer,
  prescriptions: prescriptionsReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
