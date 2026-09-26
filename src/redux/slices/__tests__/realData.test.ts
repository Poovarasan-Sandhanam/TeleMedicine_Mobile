import AsyncStorage from '@react-native-async-storage/async-storage';
import type {} from 'jest';

jest.mock('../../../utilis/api', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), put: jest.fn() },
}));

import api from '../../../utilis/api';
import store, { LOGOUT } from '../../store';
import { fetchBookings } from '../bookingSlice';
import { fetchDoctorTypes } from '../doctorTypeSlice';
import { fetchAppointments } from '../appointmentRecordSlice';

const mockGet = api.get as jest.Mock;

beforeEach(async () => {
  jest.clearAllMocks();
  await AsyncStorage.clear();
  store.dispatch({ type: LOGOUT });
});

describe('slices show real data only', () => {
  it('starts empty rather than with sample records', () => {
    const state = store.getState();
    expect(state.bookings.bookings).toEqual([]);
    expect(state.appointmentRec.appointmentRec).toEqual([]);
    expect(state.doctorTypes.doctorTypes).toEqual([]);
    expect(state.doctors.doctorDetails).toBeNull();
    expect(state.profile.profile).toBeNull();
    expect(state.profile.completedDoctors).toEqual([]);
  });

  it('reports a failed request as an error, not as sample data', async () => {
    mockGet.mockRejectedValueOnce(new Error('Network error occurred'));
    await store.dispatch(fetchBookings() as any);
    expect(store.getState().bookings.bookings).toEqual([]);
    expect(store.getState().bookings.error).toBe('Network error occurred');
  });

  it('keeps an empty server answer empty', async () => {
    mockGet.mockResolvedValueOnce({ data: { data: [] } });
    await store.dispatch(fetchDoctorTypes() as any);
    expect(store.getState().doctorTypes.doctorTypes).toEqual([]);

    mockGet.mockResolvedValueOnce({ data: { data: [] } });
    await store.dispatch(fetchAppointments('01-10-2026') as any);
    expect(store.getState().appointmentRec.appointmentRec).toEqual([]);
  });
});

describe('bookings list per role', () => {
  it('patients load the bookings they made', async () => {
    await AsyncStorage.setItem('isDoctor', 'false');
    mockGet.mockResolvedValueOnce({ data: { data: { bookingDetails: [{ _id: 'a1' }] } } });
    await store.dispatch(fetchBookings() as any);
    expect(mockGet.mock.calls[0][0]).toBe('/payment/get-bookings');
    expect(store.getState().bookings.bookings).toEqual([{ _id: 'a1' }]);
  });

  it('doctors load the bookings made with them', async () => {
    await AsyncStorage.setItem('isDoctor', 'true');
    mockGet.mockResolvedValueOnce({ data: { data: { bookingDetails: [] } } });
    await store.dispatch(fetchBookings() as any);
    expect(mockGet.mock.calls[0][0]).toBe('/payment/get-bookings-users');
  });
});

describe('logout', () => {
  it('clears every slice so the next user starts clean', async () => {
    await AsyncStorage.setItem('isDoctor', 'false');
    mockGet.mockResolvedValueOnce({ data: { data: { bookingDetails: [{ _id: 'private' }] } } });
    await store.dispatch(fetchBookings() as any);
    expect(store.getState().bookings.bookings).toHaveLength(1);

    store.dispatch({ type: LOGOUT });
    expect(store.getState().bookings.bookings).toEqual([]);
  });
});
