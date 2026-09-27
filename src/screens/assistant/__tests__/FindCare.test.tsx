import React from 'react';
import { Linking } from 'react-native';
import { fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {} from 'jest';

jest.mock('../../../utilis/api', () => ({
  __esModule: true,
  ...jest.requireActual('../../../utilis/api'),
  default: { get: jest.fn(), post: jest.fn() },
}));

const mockNavigate = jest.fn();
let mockParams: any = {};
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate, goBack: jest.fn() }),
  useRoute: () => ({ params: mockParams }),
}));

import store from '../../../redux/store';
import api from '../../../utilis/api';
import FindCareScreen, { EMERGENCY_NUMBER } from '../FindCareScreen';
import { renderWithProviders } from '../../../test/providers';

const understanding = {
  summary: 'Chest tightness when running', specialty: 'Cardiologist', urgency: 'routine',
  day: '2026-10-01', timeOfDay: 'morning', doctorGender: null, language: null,
};
const sarah = { userId: 'doc-1', fullName: 'Dr Sarah Mitchell', specialization: 'Cardiologist', experience: 14 };

const renderScreen = () => renderWithProviders(<FindCareScreen />, store);

describe('Find care', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    mockParams = {};
    await AsyncStorage.clear();
  });

  it('asks for consent before anything can be sent', async () => {
    const screen = renderScreen();
    expect(await screen.findByText('I understand')).toBeTruthy();
    expect(screen.getByLabelText('Send')).toBeDisabled();

    fireEvent.press(screen.getByText('I understand'));
    fireEvent.changeText(screen.getByLabelText('Describe how you feel'), 'chest tightness');
    expect(screen.getByLabelText('Send')).toBeEnabled();
    expect(await AsyncStorage.getItem('aiFindCareConsent')).toBe('true');
  });

  it("sends the message with the patient's local date and hour, groups times per doctor, and hands a time to booking", async () => {
    await AsyncStorage.setItem('aiFindCareConsent', 'true');
    (api.post as jest.Mock).mockResolvedValue({ data: { data: {
      type: 'suggestions', understanding, relaxed: [], widened: false, disclaimer: 'Not a diagnosis.',
      suggestions: [
        { doctor: sarah, date: '2026-10-01', slot: '9-10' },
        { doctor: sarah, date: '2026-10-01', slot: '10-11' },
      ],
    } } });

    const screen = renderScreen();
    // Consent is read from storage just after mount; the example prompts appear once it has loaded.
    await screen.findByText('Itchy rash for a week');
    fireEvent.changeText(screen.getByLabelText('Describe how you feel'), '  I get chest tightness when I run  ');
    fireEvent.press(screen.getByLabelText('Send'));

    await waitFor(() => expect(api.post).toHaveBeenCalledTimes(1));
    const [path, body] = (api.post as jest.Mock).mock.calls[0];
    expect(path).toBe('/ai/find-care');
    expect(body.message).toBe('I get chest tightness when I run');
    expect(body.clientDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Number.isInteger(body.clientHour)).toBe(true);

    expect(await screen.findByText('Cardiologist')).toBeTruthy();
    // One card for the doctor, with both times on it.
    expect(screen.getAllByText('Dr Sarah Mitchell')).toHaveLength(1);
    fireEvent.press(screen.getByLabelText(/Book Dr Sarah Mitchell, .* at 10 AM - 11 AM/));

    expect(mockNavigate).toHaveBeenCalledWith('AppointmentBooking', expect.objectContaining({
      date: '2026-10-01', slot: '10-11', healthIssue: 'Chest tightness when running', autoReview: true,
      doctor: expect.objectContaining({ userId: 'doc-1' }),
    }));
  });

  it('shows emergency advice with a call button and no times to book', async () => {
    await AsyncStorage.setItem('aiFindCareConsent', 'true');
    (api.post as jest.Mock).mockResolvedValue({ data: { data: {
      type: 'emergency', crisis: false, reasons: ['Chest pain with other warning signs'], understanding,
    } } });
    const openURL = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);

    const screen = renderScreen();
    // Consent is read from storage just after mount; the example prompts appear once it has loaded.
    await screen.findByText('Itchy rash for a week');
    fireEvent.changeText(screen.getByLabelText('Describe how you feel'), 'crushing chest pain and sweating');
    fireEvent.press(screen.getByLabelText('Send'));

    expect(await screen.findByText('This could be an emergency')).toBeTruthy();
    expect(screen.queryByText('Tap a time to book')).toBeNull();
    fireEvent.press(screen.getByText(`Call emergency services (${EMERGENCY_NUMBER})`));
    expect(openURL).toHaveBeenCalledWith(`tel:${EMERGENCY_NUMBER}`);
  });

  it('shows the server message when the request fails', async () => {
    await AsyncStorage.setItem('aiFindCareConsent', 'true');
    (api.post as jest.Mock).mockRejectedValue(new Error('Too many requests. Please wait a few minutes and try again.'));
    const screen = renderScreen();
    // Consent is read from storage just after mount; the example prompts appear once it has loaded.
    await screen.findByText('Itchy rash for a week');
    fireEvent.changeText(screen.getByLabelText('Describe how you feel'), 'rash on my arm');
    fireEvent.press(screen.getByLabelText('Send'));
    expect(await screen.findByText('Too many requests. Please wait a few minutes and try again.')).toBeTruthy();
  });

  it('starts with a message passed in, once consent is given', async () => {
    await AsyncStorage.setItem('aiFindCareConsent', 'true');
    mockParams = { message: 'knee pain' };
    (api.post as jest.Mock).mockResolvedValue({ data: { data: {
      type: 'suggestions', understanding: { ...understanding, specialty: 'Orthopedic Surgeon' }, relaxed: [], widened: true, disclaimer: '', suggestions: [],
    } } });
    const screen = renderScreen();
    await waitFor(() => expect(api.post).toHaveBeenCalledWith('/ai/find-care', expect.objectContaining({ message: 'knee pain' }), expect.anything()));
    expect(await screen.findByText('No free times in the next week')).toBeTruthy();
  });
});
