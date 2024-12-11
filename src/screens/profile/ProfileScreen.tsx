import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const DoctorProfileScreen = () => {
  const [doctorProfile, setDoctorProfile] = useState({
    image: 'https://via.placeholder.com/100',
    name: 'Dr. Jane Doe',
    gender: 'Female',
    specialized: null,
    clinicAddress: '123 Health Street, Cityville',
    age: null,
    experience: null,
    consultationTiming: '9:00 AM - 5:00 PM',
    contactNumber: '+1234567890',
    emailId: 'dr.jane@example.com',
  });

  const [isEditing, setIsEditing] = useState(false);
  
  const specializationOptions = [
    { label: 'Cardiologist', value: 'Cardiologist' },
    { label: 'Dermatologist', value: 'Dermatologist' },
    { label: 'Neurologist', value: 'Neurologist' },
    { label: 'Pediatrician', value: 'Pediatrician' },
    { label: 'Psychiatrist', value: 'Psychiatrist' },
    { label: 'Orthopedic Surgeon', value: 'Orthopedic Surgeon' },
    { label: 'General Physician', value: 'General Physician' },
    { label: 'Ophthalmologist', value: 'Ophthalmologist' },
    { label: 'Gynecologist', value: 'Gynecologist' },
    { label: 'ENT Specialist', value: 'ENT Specialist' },
  ];
  

  // Dropdown options
  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];
  const ageOptions = Array.from({ length: 80 }, (_, i) => ({ label: `${20 + i}`, value: `${20 + i}` }));
  const experienceOptions = Array.from({ length: 51 }, (_, i) => ({ label: `${i} years`, value: `${i} years` }));

  // Handle input changes
  const handleChange = (field, value) => {
    setDoctorProfile({ ...doctorProfile, [field]: value });
  };

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert('Profile Updated', 'Your changes have been saved successfully!');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: doctorProfile.image }} style={styles.profileImage} />
        <TouchableOpacity style={styles.editImageButton}>
          <Text style={styles.editImageText}>Edit Image</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Details */}
      <View style={styles.detailsContainer}>
        {/* Name */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>Name:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={doctorProfile.name}
              onChangeText={(value) => handleChange('name', value)}
            />
          ) : (
            <Text style={styles.value}>{doctorProfile.name}</Text>
          )}
        </View>

        {/* Gender Dropdown */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>Gender:</Text>
          {isEditing ? (
            <Dropdown
              style={styles.dropdown}
              data={genderOptions}
              labelField="label"
              valueField="value"
              value={doctorProfile.gender}
              onChange={(item) => handleChange('gender', item.value)}
              placeholder="Select Gender"
            />
          ) : (
            <Text style={styles.value}>{doctorProfile.gender}</Text>
          )}
        </View>

        {/* Specialized */}
      {/* Specialization Dropdown */}
<View style={styles.detailRow}>
  <Text style={styles.label}>Specialized:</Text>
  {isEditing ? (
    <Dropdown
      style={styles.dropdown}
      data={specializationOptions}
      labelField="label"
      valueField="value"
      value={doctorProfile.specialized}
      onChange={(item) => handleChange('specialized', item.value)}
      placeholder="Select Specialization"
    />
  ) : (
    <Text style={styles.value}>{doctorProfile.specialized}</Text>
  )}
</View>


        {/* Clinic Address */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>Clinic Address:</Text>
          {isEditing ? (
            <TextInput
              style={[styles.input]}
              value={doctorProfile.clinicAddress}
              onChangeText={(value) => handleChange('clinicAddress', value)}
             
              numberOfLines={2}
            />
          ) : (
            <Text style={styles.value}>{doctorProfile.clinicAddress}</Text>
          )}
        </View>

        {/* Age Dropdown */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>Age:</Text>
          {isEditing ? (
            <Dropdown
              style={styles.dropdown}
              data={ageOptions}
              labelField="label"
              valueField="value"
              value={doctorProfile.age}
              onChange={(item) => handleChange('age', item.value)}
              placeholder="Select Age"
            />
          ) : (
            <Text style={styles.value}>{doctorProfile.age || '-'}</Text>
          )}
        </View>

        {/* Experience Dropdown */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>Experience:</Text>
          {isEditing ? (
            <Dropdown
              style={styles.dropdown}
              data={experienceOptions}
              labelField="label"
              valueField="value"
              value={doctorProfile.experience}
              onChange={(item) => handleChange('experience', item.value)}
              placeholder="Select Experience"
            />
          ) : (
            <Text style={styles.value}>{doctorProfile.experience || '-'}</Text>
          )}
        </View>

        {/* Consultation Timing */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>Consultation Timing:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={doctorProfile.consultationTiming}
              onChangeText={(value) => handleChange('consultationTiming', value)}
            />
          ) : (
            <Text style={styles.value}>{doctorProfile.consultationTiming}</Text>
          )}
        </View>

        {/* Contact Number */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>Contact Number:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={doctorProfile.contactNumber}
              onChangeText={(value) => handleChange('contactNumber', value)}
            />
          ) : (
            <Text style={styles.value}>{doctorProfile.contactNumber}</Text>
          )}
        </View>

        {/* Email ID */}
        <View style={styles.detailRow}>
          <Text style={styles.label}>Email ID:</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={doctorProfile.emailId}
              onChangeText={(value) => handleChange('emailId', value)}
            />
          ) : (
            <Text style={styles.value}>{doctorProfile.emailId}</Text>
          )}
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        {isEditing ? (
          <Button title="Save" onPress={handleSave} color="#4CAF50" />
        ) : (
          <Button title="Edit Profile" onPress={() => setIsEditing(true)} color="#2196F3" />
        )}
      </View>
    </ScrollView>
  );
};

export default DoctorProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editImageButton: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  editImageText: {
    color: '#fff',
    fontSize: 14,
  },
  detailsContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    width: '40%',
  },
  value: {
    fontSize: 16,
    color: '#555',
    flex: 1,
  },
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flex: 1,
    paddingVertical: 2,
    color: '#000',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  dropdown: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 5,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});
