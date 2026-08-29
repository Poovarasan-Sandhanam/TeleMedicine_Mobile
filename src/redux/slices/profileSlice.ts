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
  completedDoctors: any[];   // ✅ add this
  loading: boolean;
  error: string | null;
}

export const MOCK_PROFILE: NormalizedProfile = {
  name: 'John Doe (Guest)',
  age: '30',
  gender: 'Male',
  email: 'guest@telemedicine.com',
  contactNumber: '+1 234 567 8900',
  address: '123 Health Ave, Suite 100',
  bloodGroup: 'O+',
  weight: '70',
  height: '175',
  ongoingTreatment: 'None',
  healthIssues: 'Mild Allergy',
  specialized: 'General Medicine',
  experience: '5',
  consultationTiming: '09:00 AM - 05:00 PM',
  profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
  isDoctor: false,
};

export const MOCK_COMPLETED_DOCTORS = [
  {
    _id: 'doc1',
    fullName: 'Dr. Sarah Jenkins',
    specialization: 'Cardiology',
    experience: 12,
    consultationTiming: '10:00 AM - 04:00 PM',
    address: 'City Heart Hospital, NY',
    certifications: ['MD Cardiology', 'FACC'],
    languages: ['English', 'Spanish'],
    profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
  },
  {
    _id: 'doc2',
    fullName: 'Dr. Robert Chen',
    specialization: 'Dermatology',
    experience: 8,
    consultationTiming: '09:00 AM - 02:00 PM',
    address: 'Skin & Beauty Clinic',
    certifications: ['MD Dermatology', 'Board Certified'],
    languages: ['English', 'Mandarin'],
    profileImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
  },
  {
    _id: 'doc3',
    fullName: 'Dr. Emily Taylor',
    specialization: 'Pediatrics',
    experience: 15,
    consultationTiming: '08:00 AM - 01:00 PM',
    address: 'Children Care Center',
    certifications: ['MD Pediatrics', 'FAAP'],
    languages: ['English'],
    profileImage: 'https://images.unsplash.com/photo-1594824813566-88855ce78905?w=400',
  },
  {
    _id: 'doc4',
    fullName: 'Dr. Michael Vance',
    specialization: 'General Physician',
    experience: 10,
    consultationTiming: '11:00 AM - 06:00 PM',
    address: 'Wellness Medical Hub',
    certifications: ['MBBS', 'MD Internal Medicine'],
    languages: ['English', 'French'],
    profileImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
  },
];

const initialState: ProfileState = {
  profile: MOCK_PROFILE,
  completedDoctors: MOCK_COMPLETED_DOCTORS,
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
      if (!token) {return rejectWithValue('No authentication token found');}

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
      if (!token) {return rejectWithValue('No authentication token found');}

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
// FETCH COMPLETED DOCTORS
// ==========================
export const fetchCompletedDoctors = createAsyncThunk<any[], void, { rejectValue: string }>(
  'profile/fetchCompletedDoctors',
  async (_, { rejectWithValue }) => {
    try {
      console.log('📡 Fetching completed doctor profiles...');
      const token = await AsyncStorage.getItem('token');
      if (!token) {return rejectWithValue('No authentication token found');}

      const res = await api.get('/profile/get-completed-doctor-profiles', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // console.log('✅ Completed doctors fetched:', res.data?.data);
      return res.data?.data || [];
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to fetch completed doctors';
      // console.error('❌ Completed doctors fetch failed:', errorMessage);
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
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<NormalizedProfile>) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.loading = false;
        if (!state.profile) {
          state.profile = MOCK_PROFILE;
        }
        state.error = null;
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
      })
      .addCase(fetchCompletedDoctors.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCompletedDoctors.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.completedDoctors = action.payload && action.payload.length > 0 ? action.payload : MOCK_COMPLETED_DOCTORS;
      })
      .addCase(fetchCompletedDoctors.rejected, (state) => {
        state.loading = false;
        if (state.completedDoctors.length === 0) {
          state.completedDoctors = MOCK_COMPLETED_DOCTORS;
        }
        state.error = null;
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
