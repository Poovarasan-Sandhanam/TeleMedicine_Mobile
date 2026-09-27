import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import type {} from 'jest';
import moment from 'moment';

jest.mock('../../../utilis/api', () => ({
  __esModule: true,
  ...jest.requireActual('../../../utilis/api'),
  default: { get: jest.fn(), post: jest.fn() },
}));

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({ params: { doctor: { userId: 'doctor-1', fullName: 'Dr Test', specialization: 'Cardiologist' } } }),
  useNavigation: () => ({ navigate: mockNavigate }),
}));

import store from '../../../redux/store';
import api from '../../../utilis/api';
import AppointmentBookingScreen from '../AppointmentBooking';
import { renderWithProviders } from '../../../test/providers';

const tomorrow = moment().startOf('day').add(1, 'day');

describe('booking an appointment through the screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (api.get as jest.Mock).mockResolvedValue({
      data: { data: { slots: [
        { slotTiming: '9-10', isBooked: false },
        { slotTiming: '10-11', isBooked: true },
      ] } },
    });
    (api.post as jest.Mock).mockResolvedValue({ data: { status: true, data: { id: 'appt-1' } } });
  });

  it('books the chosen day, time and reason, then celebrates', async () => {
    const screen = renderWithProviders(<AppointmentBookingScreen navigation={{ navigate: mockNavigate, goBack: jest.fn() }} />, store);

    fireEvent.press(screen.getByLabelText(tomorrow.format('dddd D MMMM')));
    // Slots for the chosen day load without a separate "check availability" step.
    await waitFor(() =>
      expect(api.get).toHaveBeenLastCalledWith('/appointment/get-all-doctors', expect.objectContaining({
        params: { id: 'doctor-1', selectedDate: tomorrow.format('YYYY-MM-DD') },
      })),
    );

    const booked = await screen.findByLabelText('10 AM');
    expect(booked).toBeDisabled();
    fireEvent.press(await screen.findByLabelText('9 AM'));
    fireEvent.changeText(screen.getByLabelText('Health issue'), '  Chest pain  ');

    const review = screen.getByTestId('review-booking');
    expect(review).toBeEnabled();
    fireEvent.press(review);
    fireEvent.press(await screen.findByText('Confirm Booking'));

    await waitFor(() => expect(api.post).toHaveBeenCalledTimes(1));
    expect(api.post).toHaveBeenCalledWith(
      '/appointment/booking',
      { doctorId: 'doctor-1', date: tomorrow.format('YYYY-MM-DD'), time: '9-10', healthIssue: 'Chest pain', notes: '' },
      expect.anything(),
    );
    expect(await screen.findByText("You're booked!")).toBeTruthy();

    fireEvent.press(screen.getByText('View my bookings'));
    expect(mockNavigate).toHaveBeenCalledWith('Home', { screen: 'MyBooking' });
  });

  it('shows the server message when booking fails, and stays on review', async () => {
    (api.post as jest.Mock).mockRejectedValueOnce(new Error('This appointment is already booked'));
    const screen = renderWithProviders(<AppointmentBookingScreen navigation={{ navigate: mockNavigate, goBack: jest.fn() }} />, store);

    fireEvent.press(screen.getByLabelText(tomorrow.format('dddd D MMMM')));
    fireEvent.press(await screen.findByLabelText('9 AM'));
    fireEvent.changeText(screen.getByLabelText('Health issue'), 'Chest pain');
    fireEvent.press(screen.getByTestId('review-booking'));
    fireEvent.press(await screen.findByText('Confirm Booking'));

    expect(await screen.findByText('This appointment is already booked')).toBeTruthy();
    expect(screen.queryByText("You're booked!")).toBeNull();
  });
});
