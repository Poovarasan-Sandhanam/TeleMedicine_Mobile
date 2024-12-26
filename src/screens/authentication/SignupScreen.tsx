import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  SafeAreaView,
  ScrollView,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import PasswordVisibilityToggle from '../../components/PasswordVisibilityToggle';
import LoadingSpinner from '../../components/LoadingSpinner';
import {signup} from '../../redux/actions/authActions'; // Adjust the path as needed

const RadioButtonGroup = ({options, selectedValue, onSelect}) => {
  return (
    <View style={styles.radioGroup}>
      {options.map(option => (
        <TouchableOpacity
          key={option.value}
          style={styles.radioOption}
          onPress={() => onSelect(option.value)}>
          <View
            style={[
              styles.radioButton,
              selectedValue === option.value && styles.radioSelected,
            ]}
          />
          <Text style={styles.radioLabel}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const SignupScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [userType, setUserType] = useState('Patient'); // Default to Patient
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [doctorType, setDoctorType] = useState('');
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const {error, loading} = useSelector(state => state.auth);

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validateFields = () => {
    const newErrors = {};
    if (!name) newErrors.name = 'Name is required.';
    if (!dob) newErrors.dob = 'Date of Birth is required.';
    if (!gender) newErrors.gender = 'Gender is required.';
    if (!contactNumber || !/^\d{10}$/.test(contactNumber))
      newErrors.contactNumber = 'Valid contact number is required.';
    if (!email || !/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}$/i.test(email))
      newErrors.email = 'Valid email is required.';
    if (!password || !passwordRegex.test(password)) 
      newErrors.password = 'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.';
    if (password !== confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match.';
    if (userType === 'Doctor' && !doctorType)
      newErrors.doctorType = 'Doctor specialization is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = () => {
    if (validateFields()) {
      const formattedDob = dob.toISOString().split('T')[0];
      const userData = {
        fullName: name,
        dob: formattedDob,
        contactNo: parseInt(contactNumber, 10),
        email,
        password,
        isDoctor: userType === 'Doctor',
        doctorType: userType === 'Doctor' ? doctorType : '',
        gender,
      };

      dispatch(signup(userData))
        .then(() => {
          Alert.alert('Signup successful');
          navigation.navigate('Login');
        })
        .catch(err => {
          console.error('Signup failed:', err);
        });
    } else {
      console.error('Validation failed:', errors);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, justifyContent: 'center', margin: 15}}>
        <LoadingSpinner visible={loading} />
        <Text style={styles.title}>Sign Up</Text>

        {/* Name */}
        <TextInput
          style={[styles.input, errors.name ? styles.inputError : null]}
          placeholder="User Name"
          placeholderTextColor="#aaa"
          value={name}
          onChangeText={setName}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        {/* Date of Birth */}
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
          <Text style={dob ? styles.inputTextDate : styles.placeholderText}>
            {dob ? dob.toLocaleDateString('en-GB') : 'Date of Birth'}
          </Text>
        </TouchableOpacity>
        {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}
        {showDatePicker && (
          <DateTimePicker
            value={dob || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (event.type !== 'dismissed') setDob(selectedDate);
            }}
          />
        )}

        {/* Contact Number */}
        <TextInput
          style={[styles.input, errors.contactNumber ? styles.inputError : null]}
          placeholder="Contact Number"
          placeholderTextColor="#aaa"
          value={contactNumber}
          onChangeText={setContactNumber}
          keyboardType="phone-pad"
        />
        {errors.contactNumber && (
          <Text style={styles.errorText}>{errors.contactNumber}</Text>
        )}

        {/* Email */}
        <TextInput
          style={[styles.input, errors.email ? styles.inputError : null]}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        {/* Radio Buttons */}
        <Text style={styles.label}>Who are you?</Text>
        <RadioButtonGroup
          options={[
            {label: 'Patient', value: 'Patient'},
            {label: 'Doctor', value: 'Doctor'},
          ]}
          selectedValue={userType}
          onSelect={setUserType}
        />
        {userType === 'Doctor' && (
          <TextInput
            style={[styles.input, errors.doctorType ? styles.inputError : null]}
            placeholder="Specialization (e.g., Cardiologist)"
            placeholderTextColor="#aaa"
            value={doctorType}
            onChangeText={setDoctorType}
          />
        )}
        {errors.doctorType && (
          <Text style={styles.errorText}>{errors.doctorType}</Text>
        )}

        {/* Gender */}
        <Text style={styles.label}>Gender</Text>
        <RadioButtonGroup
          options={[
            {label: 'Male', value: 'Male'},
            {label: 'Female', value: 'Female'},
            {label: 'Other', value: 'Other'},
          ]}
          selectedValue={gender}
          onSelect={setGender}
        />
        {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

        {/* Password */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.passwordInput,
              errors.password ? styles.inputError : null,
            ]}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <PasswordVisibilityToggle
            isVisible={showPassword}
            onToggle={() => setShowPassword(!showPassword)}
          />
        </View>
        {errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}

        {/* Confirm Password */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={[
              styles.passwordInput,
              errors.confirmPassword ? styles.inputError : null,
            ]}
            placeholder="Confirm Password"
            placeholderTextColor="#aaa"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <PasswordVisibilityToggle
            isVisible={showConfirmPassword}
            onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        </View>
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
        )}

        {/* Submit */}
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Navigation to Login */}
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.contentText}>
            Already have an account? Go to Login
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor:'#fffacd'},
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    
  },
  input: {
    height: 50,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 8,
    backgroundColor: '#F3F3F3',
  },
  inputError: {borderColor: 'red'},
  inputText: {color: '#000'},
  label: {fontSize: 16, fontWeight: 'bold', marginVertical: 10},
  radioGroup: {flexDirection: 'row'},
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    marginLeft: 15,
  },
  radioButton: {
    flexDirection: 'row',
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    marginRight: 10,
  },
  radioSelected: {backgroundColor: '#191970', borderColor: '#fff'},
  radioLabel: {fontSize: 16, color: '#000', marginLeft: 5},
  errorText: {color: 'red', fontSize: 12, marginBottom: 5},

  passwordContainer: {
    height: 50,
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
     backgroundColor: '#F3F3F3',
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
  contentText: {textAlign: 'center', color: '#007BFF', marginTop: 10,fontWeight:"bold"},
  placeholderText: {
    color: '#aaa',
    marginTop: 15,
  },
  inputTextDate: {
    color: 'red ',
    marginTop: 15,
  },
});

export default SignupScreen;
