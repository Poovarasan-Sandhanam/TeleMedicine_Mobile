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
  SafeAreaView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile } from '../../redux/actions/profileActions';
import { fetchDoctorTypes } from '../../redux/actions/doctorTypeActions';
import { launchImageLibrary } from 'react-native-image-picker';

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { profile, error, doctorTypes } = useSelector((state) => state.profile);

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
    dispatch(fetchDoctorTypes());
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
    <SafeAreaView style={{flex:1,backgroundColor:"grey"}}>
      <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{
            uri: formData.profileImage?.uri || profile.profileImage || 'https://via.placeholder.com/150',
          }}
          style={styles.profileImage}
        />
        {editMode && <Button title="Change Image" onPress={handleImagePicker} />}
        
      </View>
      <View style={styles.card}>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>User Name</Text>
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
        <Text style={styles.label}>Age:</Text>
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
    <View style={styles.dropdown}>
    {doctorTypes ? (
      <Picker
        selectedValue={formData.specialized}
        onValueChange={(value) => handleInputChange('specialized', value)}
      >
        <Picker.Item label="Select Specialization" value="" />
        {doctorTypes.map((type, index) => (
          <Picker.Item key={index} label={type} value={type} />
        ))}
      </Picker>
    ) : (
      <Text>Loading Specializations...</Text>
    )}
  </View>
  
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
             <View style={{flex:0.6,flexDirection:"row"}}>
               <Text style={{fontSize:18, color: '#505',fontWeight:"600"}}>{formData.experience}</Text>
               {formData.experience? <Text style={{fontSize:18, color: '#505',fontWeight:"600"}}> years</Text>:null}
             </View>


              
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
      </View>
      
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { marginTop:40 },
  profileContainer: { alignItems: 'center', marginBottom: 20 },
  profileImage: { 
    width: 150, 
    height: 150, 
    borderRadius: 15, 
    borderWidth: 1.5, 
    borderColor: '#000' },
  editButton: {
    backgroundColor: '#007bff',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  editButtonText: { color: '#fff', fontWeight: 'bold' },
  card: {
    backgroundColor: '#fffacd',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 15,
  },
  infoContainer: { flex:1,marginBottom: 15,flexDirection:"row" },
  label: { flex:0.4,fontSize: 16, fontWeight: 'bold'},
  value: { flex:0.6,fontSize:18, color: '#505',fontWeight:"600", },
  input: {
    flex:0.7,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  loading: { textAlign: 'center', marginTop: 50 },
  error: { color: 'red', textAlign: 'center', marginTop: 50 },
  dropdown: {
    flex: 0.7,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
  },
  
});

export default ProfileScreen;
