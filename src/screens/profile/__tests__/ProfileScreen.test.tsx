import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProfileScreen from '../ProfileScreen';
import profileSlice from '../../../redux/slices/profileSlice';
import doctorTypeSlice from '../../../redux/slices/doctorTypeSlice';

// Mock the image picker
jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
}));

// Mock the back button component
jest.mock('../../../components/BackButton', () => 'GoBackButton');

// Mock the custom dropdown component
jest.mock('../../../components/CustomDropdown', () => 'CustomDropdown');

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

    const { getByText } = render(
      <Provider store={store}>
        <ProfileScreen />
      </Provider>
    );

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

    const { getByText } = render(
      <Provider store={store}>
        <ProfileScreen />
      </Provider>
    );

    expect(getByText('Loading profile...')).toBeTruthy();
  });

  it('shows retry button when profile is not available', async () => {
    // Mock the fetchProfile to return null
    const mockFetchProfile = jest.fn().mockResolvedValue(null);

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

    const { getByText } = render(
      <Provider store={store}>
        <ProfileScreen />
      </Provider>
    );

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

    const { getByText } = render(
      <Provider store={store}>
        <ProfileScreen />
      </Provider>
    );

    await waitFor(() => {
      const editButton = getByText('Edit Profile');
      fireEvent.press(editButton);
    });

    expect(getByText('Save Changes')).toBeTruthy();
  });
});
