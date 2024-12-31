import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateProfile } from '../../redux/actions/profileActions';
import { fetchDoctorTypes } from '../../redux/actions/doctorTypeActions';
import { launchImageLibrary } from 'react-native-image-picker';
import CustomDropdown from '../../components/CustomDropdown';
import { GenderEnum,MedicalConditionsEnum, BloodGroupEnum, OngoingTreatmentEnum,ConsultEnum, WeightEnum } from '../../utilis/enums';
import COLORS from '../../utilis/colors';


const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { profile, error } = useSelector((state) => state.profile);
  const { doctorTypes, loading: doctorTypesLoading } = useSelector((state) => state.doctorTypes); // Use correct path
  console.log(profile,"profile--");
  
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

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
  
    // Adjust age if the birthday has not occurred yet this year
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
  
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    return age.toString();
  };
  

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchDoctorTypes());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.fullName || '',
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
      console.log("response",response);
      
  
      // Check if the response is valid before accessing the status
      if (response && response.status) {
        Alert.alert('Success', 'Profile updated successfully.');
        setEditMode(false);
      } else {
        // If response is not valid or doesn't contain 'status'
        Alert.alert('Error', response?.message || 'Failed to update profile.');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  if (!profile || doctorTypesLoading) {
    return <Text style={styles.loading}>Loading...</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor:COLORS.white}}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileContainer}>
         {formData.profileImage?.uri || profile.profileImage? <Image
            source={{
              uri: formData.profileImage?.uri || profile.profileImage,
            }}
            style={styles.profileImage}
          /> : <Image
          source={require("../../asset/profile.png")}
          style={styles.profileImage}
          />
          }
          {editMode &&
          <TouchableOpacity style={{marginTop:20}} onPress={handleImagePicker}>
            <Text style={{fontSize:15,fontWeight:"bold"}}>Change Image</Text>
          </TouchableOpacity>
          }

        </View>
        <View style={styles.card}>
          <View   style={[styles.infoContainer, !editMode && { flexDirection: 'row' }]}>
            <Text style={styles.label}>User Name:</Text>
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
          <View style={[styles.infoContainer, !editMode && { flexDirection: 'row' }]}>
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

          <View style={[styles.infoContainer, !editMode && { flexDirection: 'row' }]}>
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

          <View style={[styles.infoContainer, !editMode && { flexDirection: 'row' }]}>
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

          <View style={[styles.infoContainer, !editMode && { flexDirection: 'row' }]}>
            <Text style={styles.label}>Gender:</Text>
            {editMode ? (
              <CustomDropdown
              data={GenderEnum}
              selectedValue={formData.gender}
              onValueChange={(value) => handleInputChange('gender', value)}
            />
            
            ) : (
              <Text style={styles.value}>{formData.gender}</Text>
            )}
          </View>

          <View style={[styles.infoContainer, !editMode && { flexDirection: 'row' }]}>
           {profile.isDoctor ? <Text style={styles.label}>Clinic Address:</Text>:<Text style={styles.label}>Address:</Text>}
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
              <View style={[styles.infoContainer, !editMode && { flexDirection: 'row' }]}>
                <Text style={styles.label}>Specialized In:</Text>
                {editMode ? (
                  <CustomDropdown
                    data={doctorTypes}
                    selectedValue={formData.specialized}
                    onValueChange={(value) => handleInputChange('specialized', value)}/>
                ) : (
                  <Text style={styles.value}>{formData.specialized}</Text>
                )}
              </View>

              <View style={[styles.infoContainer, !editMode && { flexDirection: 'row' }]}>
                <Text style={styles.label}>Experience:</Text>
                {editMode ? (
                  <TextInput
                    style={styles.input}
                    value={formData.experience}
                    keyboardType="numeric"
                    onChangeText={(value) => handleInputChange('experience', value)}
                  />
                ) : (
                  <View style={{flex:0.6}}>
                    <Text style={styles.value}>{formData.experience}
                    {formData.experience?<Text style={styles.value} > years</Text>:null}
                    </Text>
                  </View>
                )}
              </View>

              <View style={[styles.infoContainer, !editMode && { flexDirection: 'row' }]}>
                <Text style={styles.label}>Consultation Timing:</Text>
                {editMode ? (
                  <CustomDropdown
                  data={ConsultEnum}
                  selectedValue={formData.consultationTiming}
                  onValueChange={(value) => handleInputChange('consultationTiming', value)}/>
                 
                ) : (
                  <Text style={styles.value}>{formData.consultationTiming}</Text>
                )}
              </View>
            </>
          ) : (
            <>
              <View style={[styles.infoContainer, !editMode && { flexDirection: 'row' }]}>
              <Text style={styles.label}>Blood Group :</Text>
                {editMode ? (
                  <CustomDropdown
                  data={BloodGroupEnum}
                  selectedValue={formData.bloodGroup}
                  onValueChange={(value) => handleInputChange('bloodGroup', value)}
                />
                
                ) : (

                  <Text style={styles.value}>{formData.bloodGroup}</Text>
                )}
              </View>

              <View style={[styles.infoContainer, !editMode && { flexDirection: 'row' }]}>
              <Text style={styles.label}>Weight :</Text>
                {editMode ? (
                  // <TextInput
                  //   style={styles.input}
                  //   value={formData.weight}
                  //   keyboardType="numeric"
                  //   onChangeText={(value) => handleInputChange('weight', value)}
                  // />

                  <CustomDropdown
                  data={WeightEnum}
                  selectedValue={formData.weight}
                  onValueChange={(value) => handleInputChange('weight', value)}
                />
                ) : (
                  <View style={{flex:0.6}}>
                    <Text style={[styles.value,{flex:0.15}]}>{formData.weight}
                   { formData.weight?<Text style={[styles.value,{flex:0.85}]}> Kg</Text>:null}
                   </Text>
                  </View>
                )}
              </View>

              <View style={[styles.infoContainer, !editMode && { flexDirection: 'row' }]}>
              <Text style={styles.label}>Height :</Text>
                {editMode ? (
                  <TextInput
                    style={styles.input}
                    value={formData.height}
                    keyboardType="numeric"
                    onChangeText={(value) => handleInputChange('height', value)}
                  />
                ) : (
                 <View style={{flexDirection:"row",flex:0.6}}>
                  <Text style={styles.value}>{formData.height}
                 {formData.height? <Text style={styles.value}> cm</Text>:null}</Text>
                  </View>
                )}
              </View>

              <View style={[styles.infoContainer, !editMode && { flexDirection: 'row' }]}>
              <Text style={styles.label}>Ongoing Treatment :</Text>
                {editMode ? (
                  <CustomDropdown
                  data={OngoingTreatmentEnum}
                  selectedValue={formData.ongoingTreatment}
                  onValueChange={(value) => handleInputChange('ongoingTreatment', value)}
                />
                
                ) : (
                  <Text style={styles.value}>{formData.ongoingTreatment}</Text>
                )}
              </View>

              <View style={[styles.infoContainer, !editMode && { flexDirection: 'row' }]}>
                 <Text style={styles.label}>Health Issues:</Text>
                {editMode ? (
                  <CustomDropdown         
                  data={MedicalConditionsEnum}
                  selectedValue={formData.healthIssues}
                  onValueChange={(value) => handleInputChange('healthIssues', value)}
                />

                ) : (
                  <Text style={styles.value}>{formData.healthIssues}</Text>
                )}
              </View>
            </>
          )}

          {editMode ? (
            <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
              <Text style={styles.editButtonText}>Save Changes</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.saveButton} onPress={() => setEditMode(true)}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 40 },
  profileContainer: { alignItems: 'center', marginBottom: 20 },
  profileImage: { 
    width: 150, 
    height: 150, 
    borderRadius: 15, 
    borderWidth: 1.5, 
    borderColor: '#000' 
  },
  editButton: {
    backgroundColor: '#007bff',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginTop:20
  },
  saveButton:{
    backgroundColor:COLORS.black,
    padding:15,
    alignItems: 'center',
    borderRadius:15,
    width:"50%",
    marginTop:20,
    alignSelf:"center",
    marginBottom:25
  },
  editButtonText: { color: '#fff', fontWeight: 'bold' },
  card: {
    backgroundColor:COLORS.primary,
    borderRadius:25
  },
  infoContainer: { 
    flex: 1,
    marginLeft:20,
    marginTop:20,  
  },
  label: { 
    flex:0.3,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom:10,
    color:COLORS.white  
  },
  value: { 
    flex:0.7,
    fontSize: 18,
    color:COLORS.white,
    fontWeight: '600',
    marginLeft:20
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    fontSize: 16,
    width:"90%",
    height:45,
    paddingLeft: 10, 
    backgroundColor:"#fff"
  },
  loading: { fontSize: 18, color: 'gray', textAlign: 'center', marginTop: 20 },
  error: { color: 'red', textAlign: 'center' },
});

export default ProfileScreen;
