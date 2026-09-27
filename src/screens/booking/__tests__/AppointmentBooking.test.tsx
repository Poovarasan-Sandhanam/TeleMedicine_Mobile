import React from 'react';
import { Alert } from 'react-native';
import { fireEvent } from '@testing-library/react-native';
import '@testing-library/jest-native';
import type {} from 'jest';

jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');

// No network in unit tests.
jest.mock('../../../utilis/api', () => ({
  __esModule: true,
  ...jest.requireActual('../../../utilis/api'),
  default: { get: jest.fn(() => Promise.resolve({ data: { data: [] } })), post: jest.fn() },
}));

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({ params: { doctor: { userId: 'doctor-1', name: 'Dr Test' } } }),
  useNavigation: () => ({ navigate: mockNavigate }),
}));

import store from '../../../redux/store';
import api from '../../../utilis/api';
import AppointmentBookingScreen from '../AppointmentBooking';
import { renderWithProviders } from '../../../test/providers';

const renderScreen = () =>
  renderWithProviders(<AppointmentBookingScreen navigation={{ navigate: mockNavigate, goBack: jest.fn() }} />, store);

describe('AppointmentBookingScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  it('renders the booking form', () => {
    const { getByText } = renderScreen();
    expect(getByText('Book an Appointment')).toBeTruthy();
    expect(getByText('Review Booking')).toBeTruthy();
  });

  it('disables review until the form is complete, and sends nothing', () => {
    const { getByText } = renderScreen();
    const reviewButton = getByText('Review Booking');
    expect(reviewButton).toBeDisabled();
    fireEvent.press(reviewButton);
    expect(getByText('Book an Appointment')).toBeTruthy();
    expect(api.post).not.toHaveBeenCalled();
  });

  it('has no simulated payment step', () => {
    // A "Pay Now" button that booked without charging was removed; guard against
    // it coming back before real payment exists.
    const { queryByText } = renderScreen();
    expect(queryByText('Pay Now')).toBeNull();
    expect(queryByText('Proceed to Payment')).toBeNull();
  });
});
