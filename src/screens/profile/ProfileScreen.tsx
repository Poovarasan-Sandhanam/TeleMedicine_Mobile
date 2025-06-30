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
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { launchImageLibrary } from 'react-native-image-picker';

import styles from '../../styles/ProfileScreenStyle'; // externalized styles
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

const ProfileScreen = () => {
  const dispatch = useDispatch();

  const { profile, error } = useSelector((state) => state.profile);
  const { doctorTypes, loading: doctorTypesLoading } = useSelector((state) => state.doctorTypes);

  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(false);

  const calculateAge = useCallback((dob) => {
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
    dispatch(fetchProfile());
    dispatch(fetchDoctorTypes());
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
        profileImage: profile.profileImage || null,
      });
    }
  }, [profile, calculateAge]);



  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
      ...(key === 'dob' && { age: calculateAge(value) }),
    }));
  };


  const handleImagePicker = () => {
    launchImageLibrary({ mediaType: 'photo' }, (res) => {
      if (res.assets?.length > 0) {
        const img = res.assets[0];
        handleChange('profileImage', {
          uri: img.uri,
          type: img.type,
          name: img.fileName,
        });
      }
    });
  };

  const validate = () => {
    if (!formData.name || !formData.email || !formData.contactNumber) {
      Alert.alert('Error', 'Name, Email, and Contact Number are required.');
      return false;
    }
    if (isNaN(formData.age) || Number(formData.age) <= 0) {
      Alert.alert('Error', 'Age must be a valid number.');
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
    Object.keys(formData).forEach((key) => {
      if (key === 'profileImage' && formData.profileImage?.uri) {
        data.append('image', formData.profileImage);
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      const res = await dispatch(updateProfile(data));
      if (res?.status) {
        Alert.alert('Success', 'Profile updated successfully');
        setEditMode(false);
      } else {
        Alert.alert('Error', res?.message || 'Update failed');
      }
    } catch (err) {
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  if (!profile || doctorTypesLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderField = (label, key, isDropdown = false, data = null, keyboardType = 'default') => (
    <View style={styles.fieldRow}>
      <Text style={styles.label}>{label}</Text>
      {editMode ? (
        isDropdown ? (
          <CustomDropdown
            data={data}
            selectedValue={formData[key]}
            onValueChange={(val) => handleChange(key, val)}
            dropdownStyle={styles.dropdown}
          />
        ) : (
          <TextInput
            style={styles.input}
            value={formData[key]}
            onChangeText={(val) => handleChange(key, val)}
            keyboardType={keyboardType}
          />
        )
      ) : (
        <Text style={styles.value}>{formData[key] || 'N/A'}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
         <GoBackButton />
        <View style={styles.profileTop}>
          <Image
            source={
              formData.profileImage?.uri
                ? { uri: formData.profileImage.uri }
                : profile.profileImage
                  ? { uri: profile.profileImage }
                  : require('../../asset/profile.png')
            }
            style={styles.avatar}
          />
          {editMode && (
            <TouchableOpacity onPress={handleImagePicker}>
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

        <TouchableOpacity style={styles.btn} onPress={editMode ? handleSubmit : () => setEditMode(true)}>
          <Text style={styles.btnText}>{editMode ? 'Save Changes' : 'Edit Profile'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
