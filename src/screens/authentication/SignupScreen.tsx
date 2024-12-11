import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  SafeAreaView,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import useValidation from '../../utilis/useValidation';
import PasswordVisibilityToggle from '../../components/PasswordVisibilityToggle';
import LoadingSpinner from '../../components/LoadingSpinner';
import { signup } from '../../redux/actions/authActions'; // Adjust the path as needed


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

  const dispatch = useDispatch();
  const {error, loading} = useSelector(state => state.auth);
  const {errors, validateFields} = useValidation();

  const handleSignup = () => {
    console.log("Signup button clicked");
  
    // Log current state values
    console.log("Current Form Values: ", {
      name,
      dob,
      contactNumber,
      email,
      password,
      confirmPassword,
      gender,
      userType,
      doctorType,
    });
  
    // Ensure fields are validated
    if (validateFields({ email, password, name, contactNumber, gender, dob })) {
      console.log("Validation passed");
  
      if (password === confirmPassword) {
        console.log("Passwords match");
  
        // Prepare user data for request
        const userData = {
          fullName: name,
          dob: dob.toISOString(), // Convert Date to ISO format
          contactNo: parseInt(contactNumber, 10),
          email,
          password,
          isDoctor: userType === 'Doctor',
          doctorType: userType === 'Doctor' ? doctorType : "patient", // Use actual specialization input
          gender,
        };
  
        console.log("Prepared User Data: ", userData);
  
        // Dispatch signup action with user data
        dispatch(signup(userData)).then(() => {
          console.log("Signup successful, navigating to Home...");
          navigation.navigate('Home'); // Redirect to Home on success
        }).catch((error) => {
          console.error("Signup failed:", error);
        });
      } else {
        console.error("Passwords don't match");
        alert("Passwords don't match");
      }
    } else {
      console.error("Validation failed");
    }
  };
  
  
  
  return (
    <SafeAreaView style={styles.container}>
      <LoadingSpinner visible={loading} />
      <Text style={styles.title}>Sign Up</Text>

      {/* Name */}
      <TextInput
        style={[styles.input, errors.name ? styles.inputError : null]}
        placeholder="Name"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      {/* Date of Birth */}
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.input}>
        <Text style={dob ? styles.inputTextDate : styles.placeholderText}>
          {dob ? dob.toLocaleDateString('en-GB') : 'Date of Birth'}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={dob || new Date()} // Use current date if dob is null
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDob(selectedDate);
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

      {/* Doctor/Patient Radio Buttons */}
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

      {/* Gender Radio Buttons */}
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
            errors.password ? styles.inputError : null,
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

      {error && <Text style={styles.errorText}>{error}</Text>}

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', padding: 20},
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 8,
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
    borderColor: '#ccc',
    marginRight: 10,
  },
  radioSelected: {backgroundColor: '#007BFF', borderColor: '#007BFF'},
  radioLabel: {fontSize: 16, color: '#000', marginLeft: 5},
  errorText: {color: 'red', fontSize: 12, marginBottom: 5},
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {color: '#fff', fontSize: 16, fontWeight: 'bold'},
  contentText: {textAlign: 'center', color: '#007BFF', marginTop: 10},
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
