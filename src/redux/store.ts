import { createStore, combineReducers, applyMiddleware, Store } from "redux";
import { thunk, ThunkMiddleware } from "redux-thunk";
import authReducer from "./reducers/authReducers";
import profileReducer from "./reducers/profileReducers";
import doctorTypeReducer from "./reducers/doctorTypeReducers";
import doctorReducer from "./reducers/doctorReducers";
import appointmentReducer from "./reducers/appointmentReducer";
import appointmentRecordReducer from "./reducers/appointmentRecordReducer";
import { paymentReducer } from "./reducers/paymentReducer";
import { bookingReducer } from './reducers/bookingReducers';
import { prescriptionReducer } from './reducers/prescriptionReducer';
import { prescriptionsReducer } from './reducers/getPrescriptionReducers';

// Root state interface
export interface RootState {
  auth: ReturnType<typeof authReducer>;
  profile: ReturnType<typeof profileReducer>;
  doctorTypes: ReturnType<typeof doctorTypeReducer>;
  doctors: ReturnType<typeof doctorReducer>;
  appointment: ReturnType<typeof appointmentReducer>;
  appointmentRec: ReturnType<typeof appointmentRecordReducer>;
  payment: ReturnType<typeof paymentReducer>;
  bookings: ReturnType<typeof bookingReducer>;
  prescription: ReturnType<typeof prescriptionReducer>;
  prescriptions: ReturnType<typeof prescriptionsReducer>;
}

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  doctorTypes: doctorTypeReducer,
  doctors: doctorReducer,
  appointment: appointmentReducer,
  appointmentRec: appointmentRecordReducer,
  payment: paymentReducer,
  bookings: bookingReducer,
  prescription: prescriptionReducer,
  prescriptions: prescriptionsReducer,
});

// Create store with proper typing
const store: Store<RootState> = createStore(
  rootReducer, 
  applyMiddleware(thunk as ThunkMiddleware<RootState>)
);

export default store; 