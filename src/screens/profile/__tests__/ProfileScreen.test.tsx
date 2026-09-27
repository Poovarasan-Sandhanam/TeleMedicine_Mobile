import React from 'react';
import { fireEvent, waitFor } from '@testing-library/react-native';
import { configureStore } from '@reduxjs/toolkit';
import { renderWithProviders } from '../../../test/providers';
import ProfileScreen from '../ProfileScreen';
import profileSlice from '../../../redux/slices/profileSlice';
import doctorTypeSlice from '../../../redux/slices/doctorTypeSlice';

// No network in unit tests.
jest.mock('../../../utilis/api', () => ({
  __esModule: true,
  ...jest.requireActual('../../../utilis/api'),
  default: {
    get: jest.fn(() => Promise.reject(new Error('offline'))),
    put: jest.fn(),
    post: jest.fn(),
  },
}));

// Mock the image picker
jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
}));


const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      profile: profileSlice,
      doctorTypes: doctorTypeSlice,
    },
    preloadedState: initialState,
  });
};

describe('ProfileScreen', () => {
  const mockProfile = {
    name: 'John Doe',
    email: 'john@example.com',
    contactNumber: '1234567890',
    dob: '1990-01-01',
    gender: 'Male',
    address: '123 Main St',
    isDoctor: false,
    bloodGroup: 'A+',
    weight: '70',
    height: '175',
    ongoingTreatment: 'No',
    healthIssues: 'None',
  };

  const mockDoctorTypes = [
    { label: 'Cardiologist', value: 'Cardiologist' },
    { label: 'Dermatologist', value: 'Dermatologist' },
  ];

  it('renders profile information correctly', async () => {
    const store = createTestStore({
      profile: {
        profile: mockProfile,
        loading: false,
        error: null,
      },
      doctorTypes: {
        doctorTypes: mockDoctorTypes,
        loading: false,
        error: null,
      },
    });

    const { getByText } = renderWithProviders(<ProfileScreen />, store);

    await waitFor(() => {
      expect(getByText('John Doe')).toBeTruthy();
      expect(getByText('john@example.com')).toBeTruthy();
      expect(getByText('1234567890')).toBeTruthy();
    });
  });

  it('shows loading state when profile is loading', () => {
    const store = createTestStore({
      profile: {
        profile: null,
        loading: true,
        error: null,
      },
      doctorTypes: {
        doctorTypes: [],
        loading: false,
        error: null,
      },
    });

    const { getByText } = renderWithProviders(<ProfileScreen />, store);

    expect(getByText('Loading profile...')).toBeTruthy();
  });

  it('shows retry button when profile is not available', async () => {

    const store = createTestStore({
      profile: {
        profile: null,
        loading: false,
        error: null,
      },
      doctorTypes: {
        doctorTypes: [],
        loading: false,
        error: null,
      },
    });

    const { getByText } = renderWithProviders(<ProfileScreen />, store);

    // Wait for the component to render and show the retry state
    await waitFor(() => {
      expect(getByText('No profile data available')).toBeTruthy();
      expect(getByText('Retry')).toBeTruthy();
    }, { timeout: 3000 });
  });

  it('enables edit mode when edit button is pressed', async () => {
    const store = createTestStore({
      profile: {
        profile: mockProfile,
        loading: false,
        error: null,
      },
      doctorTypes: {
        doctorTypes: mockDoctorTypes,
        loading: false,
        error: null,
      },
    });

    const { getByText } = renderWithProviders(<ProfileScreen />, store);

    await waitFor(() => {
      const editButton = getByText('Edit Profile');
      fireEvent.press(editButton);
    });

    expect(getByText('Save Changes')).toBeTruthy();
  });
});
