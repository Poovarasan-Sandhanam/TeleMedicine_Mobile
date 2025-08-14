import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Image, ScrollView, TouchableOpacity, Alert,
  SafeAreaView, ActivityIndicator, KeyboardTypeOptions
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import styles from '../../styles/ProfileScreenStyle';
import CustomDropdown from '../../components/CustomDropdown';
import GoBackButton from '../../components/BackButton';
import {
  GenderEnum, MedicalConditionsEnum, BloodGroupEnum,
  OngoingTreatmentEnum, ConsultEnum, WeightEnum
} from '../../utilis/enums';
import { fetchProfile, updateProfile } from '../../redux/slices/profileSlice';
import { fetchDoctorTypes } from '../../redux/slices/doctorTypeSlice';

interface ProfileImage {
  uri: string;
  type: string;
  name: string;
}

interface FormDataType {
  name: string;
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

const ProfileScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profile, loading: profileLoading } = useAppSelector(state => state.profile);
  const { doctorTypes, loading: doctorTypesLoading } = useAppSelector(state => state.doctorTypes);

  const [formData, setFormData] = useState<FormDataType>({
    name: '', age: '', gender: '', email: '', contactNumber: '',
    address: '', bloodGroup: '', weight: '', height: '', ongoingTreatment: '',
    healthIssues: '', specialized: '', experience: '', consultationTiming: '',
    profileImage: null,
  });

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile() as any);
    dispatch(fetchDoctorTypes() as any);
  }, [dispatch]);

  useEffect(() => {
  if (profile) {
    setFormData({
      ...formData,
      age: profile.age !== undefined && profile.age !== null ? String(profile.age) : '',
    });
  }
}, [profile]);

  useEffect(() => {
    
    if (profile) {
      console.log('Fetched profile:', profile); 
      setFormData({
        name: profile.name || '',
        age: profile.age?.toString() || '',
        email: profile.email || '',
        contactNumber: profile.contactNumber || '',
        address: profile.address || '',
        gender: profile.gender || '',
        bloodGroup: profile.bloodGroup || '',
        weight: profile.weight || '',
        height: profile.height?.toString() || '',
        ongoingTreatment: profile.ongoingTreatment || '',
        healthIssues: profile.healthIssues || '',
        specialized: profile.specialized || '',
        experience: profile.experience?.toString() || '',
        consultationTiming: profile.consultationTiming || '',
        profileImage: profile.profileImage
          ? { uri: profile.profileImage, type: 'image/jpeg', name: 'profile.jpg' }
          : null,
      });
    }
  }, [profile]);

  const handleChange = (key: keyof FormDataType, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleImagePicker = () => {
    launchImageLibrary({ mediaType: 'photo' }, (res: ImagePickerResponse) => {
      if (res.assets && res.assets.length > 0) {
        const img = res.assets[0];
        if (img.uri) {
          setFormData(prev => ({
            ...prev,
            profileImage: { uri: img.uri, type: img.type || 'image/jpeg', name: img.fileName || 'profile.jpg' },
          }));
        }
      }
    });
  };

  const validate = () => {
    if (!formData.name || !formData.email || !formData.contactNumber) {
      Alert.alert('Error', 'Name, Email, and Contact Number are required.');
      return false;
    }
    const ageNum = Number(formData.age);
    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      Alert.alert('Error', 'Age must be a valid number between 1 and 120.');
      return false;
    }
    if (formData.contactNumber.length < 10) {
      Alert.alert('Error', 'Contact Number must be at least 10 digits.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const data = new FormData();

    if (formData.profileImage) {
      data.append('profileImage', {
        uri: formData.profileImage.uri,
        type: formData.profileImage.type,
        name: formData.profileImage.name,
      } as any);
    }

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'profileImage') {
        data.append(key, value.toString());
      }
    });

    try {
      const res = await dispatch(updateProfile(data) as any);
      if (!res.error) {
        Alert.alert('Success', 'Profile updated successfully');
        setEditMode(false);
        dispatch(fetchProfile() as any);
      } else {
        Alert.alert('Error', res.payload || 'Update failed');
      }
    } catch {
      Alert.alert('Error', 'Unexpected error occurred.');
    }
  };

  const renderField = (
    label: string,
    key: keyof FormDataType,
    isDropdown = false,
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
            onValueChange={val => handleChange(key, val as string)}
            dropdownStyle={styles.dropdown}
          />
        ) : (
          <TextInput
            style={styles.input}
            value={formData[key] as string}
            onChangeText={val => handleChange(key, val)}
            keyboardType={keyboardType}
          />
        )
      ) : (
        <Text style={styles.value}>{formData[key] || 'N/A'}</Text>
      )}
    </View>
  );

  if (profileLoading || doctorTypesLoading) {
    return <ActivityIndicator style={styles.center} size="large" />;
  }

  const isDoctor = profile?.isDoctor;

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
        {renderField('Age', 'age')}
        {renderField('Gender', 'gender', true, GenderEnum)}
        {renderField(isDoctor ? 'Clinic Address' : 'Address', 'address')}

        {isDoctor ? (
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
          onPress={editMode ? handleSubmit : () => setEditMode(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.btnText}>{editMode ? 'Save Changes' : 'Edit Profile'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
