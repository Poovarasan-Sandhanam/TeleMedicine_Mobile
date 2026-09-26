import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import profileSlice from './slices/profileSlice';
import doctorTypeSlice from './slices/doctorTypeSlice';
import doctorSlice from './slices/doctorSlice';
import appointmentSlice from './slices/appointmentSlice';
import appointmentRecordSlice from './slices/appointmentRecordSlice';
import paymentSlice from './slices/paymentSlice';
import bookingSlice from './slices/bookingSlice';
import prescriptionSlice from './slices/prescriptionSlice';
import prescriptionsSlice from './slices/prescriptionsSlice';
import symptomSlice from './slices/symptomSlice';

/** Dispatch on sign-out to wipe every slice back to its initial state. */
export const LOGOUT = 'LOGOUT';

const appReducer = combineReducers({
    auth: authSlice,
    profile: profileSlice,
    doctorTypes: doctorTypeSlice,
    doctors: doctorSlice,
    appointment: appointmentSlice,
    appointmentRec: appointmentRecordSlice,
    payment: paymentSlice,
    bookings: bookingSlice,
    prescription: prescriptionSlice,
    prescriptions: prescriptionsSlice,
    symptom: symptomSlice,
});

// The drawer dispatched LOGOUT, but no reducer handled it, so the previous user's
// profile, bookings and appointments stayed in memory for whoever signed in next.
const rootReducer: typeof appReducer = (state, action) =>
  appReducer(action.type === LOGOUT ? undefined : state, action);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof appReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;
