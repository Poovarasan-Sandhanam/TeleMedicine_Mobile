import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import type {} from 'jest';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../../../utilis/api', () => ({
  __esModule: true,
  ...jest.requireActual('../../../utilis/api'),
  default: { get: jest.fn(), post: jest.fn() },
}));

const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useRoute: () => ({ params: { appointmentId: 'appt-9', patientName: 'Alice Johnson' } }),
  useNavigation: () => ({ goBack: mockGoBack, navigate: jest.fn() }),
}));

import store from '../../../redux/store';
import api from '../../../utilis/api';
import WritePrescription from '../DoctorPrescriptionScreen';
import { renderWithProviders } from '../../../test/providers';

describe('writing a prescription', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    // A signed-in doctor; the request is refused client-side without a token.
    await AsyncStorage.setItem('token', 'test-token');
    (api.post as jest.Mock).mockResolvedValue({ data: { status: true, data: { id: 'rx-1' } } });
  });

  it('needs a diagnosis and a medicine before it can be issued', async () => {
    const screen = renderWithProviders(<WritePrescription />, store);
    expect(screen.getByText('Add at least one medicine')).toBeTruthy();
    expect(screen.getByText('Add medicine')).toBeTruthy();
  });

  it('sends the appointment, diagnosis and medicines, then confirms', async () => {
    const screen = renderWithProviders(<WritePrescription />, store);

    fireEvent.changeText(screen.getByPlaceholderText('e.g. Tension headache'), 'Migraine');
    fireEvent.changeText(screen.getByPlaceholderText('Separate with commas'), 'headache, nausea');
    fireEvent.changeText(screen.getByPlaceholderText('Medicine name'), 'Sumatriptan');
    fireEvent.changeText(screen.getByPlaceholderText('Dosage'), '50mg');
    fireEvent.changeText(screen.getByPlaceholderText('How often'), 'As needed');
    fireEvent.changeText(screen.getByPlaceholderText('For how long (e.g. 5 days)'), '10 days');
    fireEvent.press(screen.getByText('Add medicine'));
    // Rendered as one line, "Sumatriptan · 50mg".
    expect(await screen.findByText(/Sumatriptan/)).toBeTruthy();

    fireEvent.press(screen.getByText('Issue Prescription'));
    await waitFor(() => expect(api.post).toHaveBeenCalledTimes(1));
    const [path, body] = (api.post as jest.Mock).mock.calls[0];
    expect(path).toBe('/prescription/add-prescription');
    expect(body).toEqual(expect.objectContaining({
      appointmentId: 'appt-9',
      patientName: 'Alice Johnson',
      diagnosis: 'Migraine',
      symptoms: ['headache', 'nausea'],
      medications: [{ name: 'Sumatriptan', dosage: '50mg', frequency: 'As needed', duration: '10 days' }],
    }));
    expect(await screen.findByText('Prescription issued')).toBeTruthy();
  });
});
