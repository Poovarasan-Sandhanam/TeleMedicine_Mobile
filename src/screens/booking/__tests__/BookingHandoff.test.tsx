import React from 'react';
import { waitFor } from '@testing-library/react-native';
import type {} from 'jest';
import moment from 'moment';

jest.mock('../../../utilis/api', () => ({
  __esModule: true,
  ...jest.requireActual('../../../utilis/api'),
  default: { get: jest.fn(), post: jest.fn() },
}));

const tomorrow = moment().startOf('day').add(1, 'day').format('YYYY-MM-DD');
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({ params: {
    doctor: { userId: 'doctor-1', fullName: 'Dr Test', specialization: 'Cardiologist' },
    date: require('moment')().startOf('day').add(1, 'day').format('YYYY-MM-DD'),
    slot: '9-10',
    healthIssue: 'Chest tightness when running',
    autoReview: true,
  } }),
  useNavigation: () => ({ navigate: jest.fn() }),
}));

import store from '../../../redux/store';
import api from '../../../utilis/api';
import AppointmentBookingScreen from '../AppointmentBooking';
import { renderWithProviders } from '../../../test/providers';

describe('booking handed over from Find care', () => {
  beforeEach(() => jest.clearAllMocks());

  it('opens review with the chosen day, time and reason - but does not book by itself', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: { data: { slots: [{ slotTiming: '9-10', isBooked: false }] } } });
    const screen = renderWithProviders(<AppointmentBookingScreen navigation={{ navigate: jest.fn(), goBack: jest.fn() }} />, store);

    await waitFor(() => expect(api.get).toHaveBeenCalledWith('/appointment/get-all-doctors', expect.objectContaining({
      params: { id: 'doctor-1', selectedDate: tomorrow },
    })));
    expect(await screen.findByText('Review Appointment')).toBeTruthy();
    expect(screen.getAllByText('Chest tightness when running').length).toBeGreaterThan(0);
    expect(screen.getByText('Confirm Booking')).toBeTruthy();
    expect(api.post).not.toHaveBeenCalled();
  });

  it('does not open review when the time has been taken meanwhile', async () => {
    (api.get as jest.Mock).mockResolvedValue({ data: { data: { slots: [{ slotTiming: '9-10', isBooked: true }] } } });
    const screen = renderWithProviders(<AppointmentBookingScreen navigation={{ navigate: jest.fn(), goBack: jest.fn() }} />, store);
    await waitFor(() => expect(api.get).toHaveBeenCalled());
    await new Promise(r => setTimeout(r, 50));
    expect(screen.queryByText('Review Appointment')).toBeNull();
  });
});
