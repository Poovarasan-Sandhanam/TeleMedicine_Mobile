import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import AppointmentBookingScreen from '../AppointmentBooking';
import '@testing-library/jest-native';
import type {} from 'jest';

describe('AppointmentBookingScreen', () => {
  it('shows payment modal before booking', async () => {
    const navigation = { navigate: jest.fn() };
    const { getByText, queryByText } = render(<AppointmentBookingScreen navigation={navigation} />);
    // Simulate filling required fields (mock as needed)
    // fireEvent.changeText(...)
    // fireEvent.press(...)
    // For now, just test modal logic
    fireEvent.press(getByText('Confirm Booking'));
    expect(getByText('Payment')).toBeTruthy();
    fireEvent.press(getByText('Pay Now'));
    await waitFor(() => expect(navigation.navigate).toHaveBeenCalledWith('MyBooking'));
  });
}); 