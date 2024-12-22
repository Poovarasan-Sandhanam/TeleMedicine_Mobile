import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile } from '../../redux/actions/profileActions';
import { launchImageLibrary } from 'react-native-image-picker';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { profile, error } = useSelector((state) => state.profile);

  const [formData, setFormData] = useState({
    name: '',
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

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.fullName || '',
        age: profile.age?.toString() || '',
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
  }, [profile]);

  const handleInputChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const validateInputs = () => {
    if (!formData.name || !formData.email || !formData.contactNumber) {
      Alert.alert('Validation Error', 'Name, Email, and Contact Number are required.');
      return false;
    }
    if (isNaN(formData.age) || formData.age <= 0) {
      Alert.alert('Validation Error', 'Age must be a positive number.');
      return false;
    }
    if (formData.contactNumber.length < 10) {
      Alert.alert('Validation Error', 'Contact Number must be at least 10 digits.');
      return false;
    }
    return true;
  };

  const handleImagePicker = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];
        setFormData({
          ...formData,
          profileImage: {
            uri: selectedImage.uri,
            type: selectedImage.type,
            name: selectedImage.fileName,
          },
        });
      }
    });
  };

  const handleSubmit = async () => {
    if (!validateInputs()) return;

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === 'profileImage' && formData.profileImage) {
          data.append('image', formData.profileImage);
        } else {
          data.append(key, formData[key]);
        }
      });

      const response = await dispatch(updateProfile(data));
      if (response.status) {
        Alert.alert('Success', 'Profile updated successfully.');
        setEditMode(false);
      } else {
        Alert.alert('Error', response.message || 'Failed to update profile.');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  if (error) {
    return <Text style={styles.error}>Error: {error}</Text>;
  }

  if (!profile) {
    return <Text style={styles.loading}>Loading...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{
          uri: formData.profileImage?.uri || profile.profileImage || 'https://via.placeholder.com/150',
        }}
        style={styles.profileImage}
      />
      {editMode && <Button title="Change Image" onPress={handleImagePicker} />}

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Full Name:</Text>
        {editMode ? (
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
          />
        ) : (
          <Text style={styles.value}>{formData.name}</Text>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Contact No:</Text>
        {editMode ? (
          <TextInput
            style={styles.input}
            value={formData.contactNumber}
            onChangeText={(value) => handleInputChange('contactNumber', value)}
          />
        ) : (
          <Text style={styles.value}>{formData.contactNumber}</Text>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Email:</Text>
        {editMode ? (
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
          />
        ) : (
          <Text style={styles.value}>{formData.email}</Text>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>DOB (Age):</Text>
        {editMode ? (
          <TextInput
            style={styles.input}
            value={formData.age}
            keyboardType="numeric"
            onChangeText={(value) => handleInputChange('age', value)}
          />
        ) : (
          <Text style={styles.value}>{formData.age}</Text>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Gender:</Text>
        {editMode ? (
          <TextInput
            style={styles.input}
            value={formData.gender}
            onChangeText={(value) => handleInputChange('gender', value)}
          />
        ) : (
          <Text style={styles.value}>{formData.gender}</Text>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>Address:</Text>
        {editMode ? (
          <TextInput
            style={styles.input}
            value={formData.address}
            onChangeText={(value) => handleInputChange('address', value)}
          />
        ) : (
          <Text style={styles.value}>{formData.address}</Text>
        )}
      </View>

      {profile.isDoctor ? (
        <>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Specialized:</Text>
            {editMode ? (
              <TextInput
                style={styles.input}
                value={formData.specialized}
                onChangeText={(value) => handleInputChange('specialized', value)}
              />
            ) : (
              <Text style={styles.value}>{formData.specialized}</Text>
            )}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.label}>Experience:</Text>
            {editMode ? (
              <TextInput
                style={styles.input}
                value={formData.experience}
                keyboardType="numeric"
                onChangeText={(value) => handleInputChange('experience', value)}
              />
            ) : (
              <Text style={styles.value}>{formData.experience} years</Text>
            )}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.label}>Consultation Timing:</Text>
            {editMode ? (
              <TextInput
                style={styles.input}
                value={formData.consultationTiming}
                onChangeText={(value) => handleInputChange('consultationTiming', value)}
              />
            ) : (
              <Text style={styles.value}>{formData.consultationTiming}</Text>
            )}
          </View>
        </>
      ) : (
        <>
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Blood Group:</Text>
            {editMode ? (
              <TextInput
                style={styles.input}
                value={formData.bloodGroup}
                onChangeText={(value) => handleInputChange('bloodGroup', value)}
              />
            ) : (
              <Text style={styles.value}>{formData.bloodGroup}</Text>
            )}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.label}>Weight:</Text>
            {editMode ? (
              <TextInput
                style={styles.input}
                value={formData.weight}
                keyboardType="numeric"
                onChangeText={(value) => handleInputChange('weight', value)}
              />
            ) : (
              <Text style={styles.value}>{formData.weight} kg</Text>
            )}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.label}>Height:</Text>
            {editMode ? (
              <TextInput
                style={styles.input}
                value={formData.height}
                keyboardType="numeric"
                onChangeText={(value) => handleInputChange('height', value)}
              />
            ) : (
              <Text style={styles.value}>{formData.height} cm</Text>
            )}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.label}>Ongoing Treatment:</Text>
            {editMode ? (
              <TextInput
                style={styles.input}
                value={formData.ongoingTreatment}
                onChangeText={(value) => handleInputChange('ongoingTreatment', value)}
              />
            ) : (
              <Text style={styles.value}>{formData.ongoingTreatment}</Text>
            )}
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.label}>Health Issues:</Text>
            {editMode ? (
              <TextInput
                style={styles.input}
                value={formData.healthIssues}
                onChangeText={(value) => handleInputChange('healthIssues', value)}
              />
            ) : (
              <Text style={styles.value}>{formData.healthIssues}</Text>
            )}
          </View>
        </>
      )}

      {editMode ? (
        <Button title="Save Changes" onPress={handleSubmit} />
      ) : (
        <TouchableOpacity style={styles.editButton} onPress={() => setEditMode(true)}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  profileImage: { width: 150, height: 150, borderRadius: 75, marginBottom: 20 },
  infoContainer: { marginBottom: 15 },
  label: { fontWeight: 'bold', marginBottom: 5 },
  value: { fontSize: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5 },
  editButton: {
    backgroundColor: '#007bff',
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 5,
  },
  editButtonText: { color: '#fff', fontWeight: 'bold' },
  loading: { textAlign: 'center', marginTop: 50 },
  error: { color: 'red', textAlign: 'center', marginTop: 50 },
});

export default ProfileScreen;

