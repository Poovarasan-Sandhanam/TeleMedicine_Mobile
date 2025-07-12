import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  KeyboardTypeOptions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';

import styles from '../../styles/ProfileScreenStyle';
import CustomDropdown from '../../components/CustomDropdown';
import GoBackButton from '../../components/BackButton';
import {
  GenderEnum,
  MedicalConditionsEnum,
  BloodGroupEnum,
  OngoingTreatmentEnum,
  ConsultEnum,
  WeightEnum,
} from '../../utilis/enums';

import { fetchProfile, updateProfile } from '../../redux/actions/profileActions';
import { fetchDoctorTypes } from '../../redux/actions/doctorTypeActions';
import { RootState } from '../../redux/store';

interface ProfileImage {
  uri: string;
  type: string;
  name: string;
}

interface FormData {
  name: string;
  dob: string;
  age: string;
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
  profileImage: ProfileImage | null;
}

interface Profile {
  fullName?: string;
  dob?: string;
  gender?: string;
  email?: string;
  contactNo?: number;
  address?: string;
  bloodGroup?: string;
  weight?: number;
  height?: number;
  ongoingTreatment?: string;
  healthIssues?: string;
  specialized?: string;
  experience?: number;
  consultationTiming?: string;
  profileImage?: string;
  isDoctor?: boolean;
}

const ProfileScreen: React.FC = () => {
  const dispatch = useDispatch();

  const { profile } = useSelector((state: RootState) => state.profile);
  const { doctorTypes, loading: doctorTypesLoading } = useSelector((state: RootState) => state.doctorTypes);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    dob: '',
    age: '',
    gender: '',
    email: '',
    contactNumber: '',
    address: '',
    bloodGroup: '',
    weight: '',
    height: '',
    ongoingTreatment: '',
    healthIssues: '',
    specialized: '',
    experience: '',
    consultationTiming: '',
    profileImage: null,
  });

  const [editMode, setEditMode] = useState<boolean>(false);

  const calculateAge = useCallback((dob: string): string => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  }, []);

  useEffect(() => {
    dispatch(fetchProfile() as any);
    dispatch(fetchDoctorTypes() as any);
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.fullName || '',
        dob: profile.dob || '',
        age: profile.dob ? calculateAge(profile.dob) : '',
        gender: profile.gender || '',
        email: profile.email || '',
        contactNumber: profile.contactNo?.toString() || '',
        address: profile.address || '',
        bloodGroup: profile.bloodGroup || '',
        weight: profile.weight?.toString() || '',
        height: profile.height?.toString() || '',
        ongoingTreatment: profile.ongoingTreatment || '',
        healthIssues: profile.healthIssues || '',
        specialized: profile.specialized || '',
        experience: profile.experience?.toString() || '',
        consultationTiming: profile.consultationTiming || '',
        profileImage: profile.profileImage ? { uri: profile.profileImage, type: '', name: '' } : null,
      });
    }
  }, [profile, calculateAge]);

  const handleChange = useCallback((key: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
      ...(key === 'dob' && { age: calculateAge(value) }),
    }));
  }, [calculateAge]);

  const handleImagePicker = useCallback(() => {
    launchImageLibrary({ mediaType: 'photo' }, (res: ImagePickerResponse) => {
      if (res.assets && res.assets.length > 0) {
        const img = res.assets[0];
        if (img.uri) {
          setFormData((prev) => ({
            ...prev,
            profileImage: {
              uri: img.uri,
              type: img.type || '',
              name: img.fileName || '',
            },
          }));
        }
      }
    });
  }, []);

  const validate = useCallback((): boolean => {
    if (!formData.name || !formData.email || !formData.contactNumber) {
      Alert.alert('Error', 'Name, Email, and Contact Number are required.');
      return false;
    }
    if (isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      Alert.alert('Error', 'Age must be a valid number.');
      return false;
    }
    if (formData.contactNumber.length < 10) {
      Alert.alert('Error', 'Contact Number must be at least 10 digits.');
      return false;
    }
    return true;
  }, [formData]);

  const handleSubmit = useCallback(async () => {
    if (!validate()) return;

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'profileImage' && value && typeof value === 'object' && 'uri' in value) {
        data.append('image', value as any);
      } else {
        data.append(key, value as string);
      }
    });

    try {
      const res = await dispatch(updateProfile(data) as any);
      if (res?.status) {
        Alert.alert('Success', 'Profile updated successfully');
        setEditMode(false);
      } else {
        Alert.alert('Error', res?.message || 'Update failed');
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  }, [formData, validate, dispatch]);

  const handleEditModeToggle = useCallback(() => {
    setEditMode(true);
  }, []);

  const renderField = useCallback((
    label: string,
    key: keyof FormData,
    isDropdown: boolean = false,
    data: any = null,
    keyboardType: KeyboardTypeOptions = 'default'
  ) => (
    <View style={styles.fieldRow} key={key}>
      <Text style={styles.label}>{label}</Text>
      {editMode ? (
        isDropdown ? (
          <CustomDropdown
            data={data}
            selectedValue={formData[key] as string}
            onValueChange={(val) => handleChange(key, val as string)}
            dropdownStyle={styles.dropdown}
          />
        ) : (
          <TextInput
            style={styles.input}
            value={formData[key] as string}
            onChangeText={(val) => handleChange(key, val)}
            keyboardType={keyboardType}
          />
        )
      ) : (
        <Text style={styles.value}>{formData[key] || 'N/A'}</Text>
      )}
    </View>
  ), [editMode, formData, handleChange]);

  if (!profile || doctorTypesLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <GoBackButton />
        <View style={styles.profileTop}>
          <Image
            source={
              formData.profileImage?.uri
                ? { uri: formData.profileImage.uri }
                : require('../../asset/profile.png')
            }
            style={styles.avatar}
          />
          {editMode && (
            <TouchableOpacity onPress={handleImagePicker} activeOpacity={0.7}>
              <Text style={styles.change}>Change Image</Text>
            </TouchableOpacity>
          )}
        </View>

        {renderField('Name', 'name')}
        {renderField('Email', 'email')}
        {renderField('Contact Number', 'contactNumber', false, null, 'phone-pad')}
        {renderField('Date of Birth', 'dob', false, null, 'default')}
        {renderField('Gender', 'gender', true, GenderEnum)}
        {renderField(profile.isDoctor ? 'Clinic Address' : 'Address', 'address')}

        {profile.isDoctor ? (
          <>
            {renderField('Specialized In', 'specialized', true, doctorTypes)}
            {renderField('Experience (years)', 'experience', false, null, 'numeric')}
            {renderField('Consultation Timing', 'consultationTiming', true, ConsultEnum)}
          </>
        ) : (
          <>
            {renderField('Blood Group', 'bloodGroup', true, BloodGroupEnum)}
            {renderField('Weight', 'weight', true, WeightEnum)}
            {renderField('Height (cm)', 'height', false, null, 'numeric')}
            {renderField('Ongoing Treatment', 'ongoingTreatment', true, OngoingTreatmentEnum)}
            {renderField('Health Issues', 'healthIssues', true, MedicalConditionsEnum)}
          </>
        )}

        <TouchableOpacity
          style={styles.btn}
          onPress={editMode ? handleSubmit : handleEditModeToggle}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>{editMode ? 'Save Changes' : 'Edit Profile'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
