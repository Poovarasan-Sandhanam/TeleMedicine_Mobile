import { configureStore } from '@reduxjs/toolkit';
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

export const store = configureStore({
  reducer: {
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
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
