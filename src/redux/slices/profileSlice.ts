import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../../utilis/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NormalizedProfile {
  age: string;
  name: string;
  gender: string;
  email: string;
  contactNumber: string;
  address: string;
  bloodGroup: string;
  weight: string;
  height: string;
  ongoingTreatment: string;
  healthIssues: string;
  specialized: string;
  experience: string;
  consultationTiming: string;
  profileImage: string;
  isDoctor: boolean;
}

interface ProfileState {
  profile: NormalizedProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

// ==========================
// FETCH PROFILE
// ==========================
export const fetchProfile = createAsyncThunk<NormalizedProfile, void, { rejectValue: string }>(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      console.log('📡 Fetching profile...');
      const token = await AsyncStorage.getItem('token');
      if (!token) return rejectWithValue('No authentication token found');

      const res = await api.get('/profile/get-profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const raw = res.data?.data || {};

      const normalized: NormalizedProfile = {
        name: raw.fullName || raw.name || '',
        age: raw.age || '',
        gender: raw.gender || '',
        email: raw.email || '',
        contactNumber: raw.contactNo?.toString() || raw.contactNumber?.toString() || '',
        address: raw.address || '',
        bloodGroup: raw.bloodGroup || '',
        weight: raw.weight?.toString() || '',
        height: raw.height?.toString() || '',
        ongoingTreatment: raw.ongoingTreatment || '',
        healthIssues: Array.isArray(raw.healthIssues) ? raw.healthIssues.join(',') : raw.healthIssues || '',
        specialized: raw.specialized || '',
        experience: raw.experience?.toString() || '',
        consultationTiming: raw.consultationTiming || '',
        profileImage: raw.profileImage || '',
        isDoctor: raw.isDoctor || raw.role === 'DOCTOR',
      };

      // Save locally
      await AsyncStorage.setItem('localProfile', JSON.stringify(normalized));

      console.log('✅ Normalized profile:', normalized);
      return normalized;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to fetch profile';
      console.error('❌ Profile fetch failed:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// ==========================
// UPDATE PROFILE (API)
// ==========================
export const updateProfile = createAsyncThunk<any, FormData, { rejectValue: string }>(
  'profile/updateProfile',
  async (formData, { rejectWithValue }) => {
    try {
      console.log('📡 Updating profile...');
      const token = await AsyncStorage.getItem('token');
      if (!token) return rejectWithValue('No authentication token found');

      const res = await api.put('/profile/update-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('✅ Profile updated successfully');
      return res.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Profile update failed';
      console.error('❌ Profile update failed:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// ==========================
// PROFILE SLICE
// ==========================
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfileError(state) {
      state.error = null;
    },

    // -------------------------
    // Set/Update profile locally
    // -------------------------
    setLocalProfile(state, action: PayloadAction<Partial<NormalizedProfile>>) {
      if (!state.profile) {
        state.profile = {
          ...initialState.profile,
          ...action.payload,
        } as NormalizedProfile;
      } else {
        state.profile = {
          ...state.profile,
          ...action.payload,
        };
      }

      // Save to AsyncStorage
      AsyncStorage.setItem('localProfile', JSON.stringify(state.profile)).catch((err) =>
        console.error('Failed to save profile locally', err)
      );
    },

    // -------------------------
    // Load profile from AsyncStorage
    // -------------------------
    loadLocalProfile(state, action: PayloadAction<NormalizedProfile>) {
      state.profile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<NormalizedProfile>) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch profile';
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Profile update failed';
      });
  },
});

export const { clearProfileError, setLocalProfile, loadLocalProfile } = profileSlice.actions;
export default profileSlice.reducer;

// ==========================
// UTIL: Load local profile at app start
// ==========================
export const initializeLocalProfile = () => async (dispatch: any) => {
  try {
    const storedProfile = await AsyncStorage.getItem('localProfile');
    if (storedProfile) {
      dispatch(loadLocalProfile(JSON.parse(storedProfile)));
    }
  } catch (err) {
    console.error('Failed to load local profile', err);
  }
};
