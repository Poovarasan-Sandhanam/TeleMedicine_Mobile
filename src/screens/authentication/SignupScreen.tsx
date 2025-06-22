// src/screens/SignupScreen.js
import React, { useState } from 'react';
import { 
  View, 
  SafeAreaView, 
  ScrollView, 
  TextInput, 
  Text, 
  TouchableOpacity, 
  Platform, 
  KeyboardAvoidingView 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';

import SignupSchema from '../../validation/signupSchema';
import PasswordVisibilityToggle from '../../components/PasswordVisibilityToggle';
import LoadingSpinner from '../../components/LoadingSpinner';
import { signup } from '../../redux/actions/authActions';
import styles from '../../styles/signupStyles';

const RadioButtonGroup = ({ options, selectedValue, onSelect }) => (
  <View style={styles.radioGroup}>
    {options.map(option => (
      <TouchableOpacity
        key={option.value}
        style={styles.radioOption}
        onPress={() => onSelect(option.value)}
      >
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

const SignupScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { error, loading } = useSelector(state => state.auth);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSignup = async (values, { resetForm }) => {
    try {
      const formattedDob = values.dob.toISOString().split('T')[0];

      const userData = {
        fullName: values.name,
        dob: formattedDob,
        contactNo: parseInt(values.contactNumber, 10),
        email: values.email,
        password: values.password,
        isDoctor: values.userType === 'Doctor',
        doctorType: values.userType === 'Doctor' ? values.doctorType : '',
        gender: values.gender,
      };

      await dispatch(signup(userData));

      Toast.show({
        type: 'success',
        text1: 'Signup Successful 🎉',
        text2: 'Welcome aboard!',
      });

      resetForm();
      navigation.navigate('Login');
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2: err.message || 'Please try again later.',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <LoadingSpinner visible={loading} />

      <SafeAreaView style={styles.container}>
        <Formik
          initialValues={{
            name: '',
            dob: null,
            gender: '',
            contactNumber: '',
            userType: 'Patient',
            email: '',
            password: '',
            confirmPassword: '',
            doctorType: '',
          }}
          validationSchema={SignupSchema}
          onSubmit={handleSignup}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched,
            isSubmitting,
          }) => {
            const [showPassword, setShowPassword] = useState(false);
            const [showConfirmPassword, setShowConfirmPassword] = useState(false);

            return (
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.title}>Create an account :)</Text>

                {/* Name */}
                <TextInput
                  style={[styles.input, touched.name && errors.name ? styles.inputError : null]}
                  placeholder="User Name"
                  placeholderTextColor="#aaa"
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                />
                {touched.name && errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}

                {/* Date of Birth */}
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  style={[styles.input, touched.dob && errors.dob ? styles.inputError : null]}
                >
                  <Text style={values.dob ? styles.inputTextDate : styles.placeholderText}>
                    {values.dob ? values.dob.toLocaleDateString('en-GB') : 'Date of Birth'}
                  </Text>
                </TouchableOpacity>
                {touched.dob && errors.dob && (
                  <Text style={styles.errorText}>{errors.dob}</Text>
                )}
                {showDatePicker && (
                  <DateTimePicker
                    value={values.dob || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                    onChange={(event, selectedDate) => {
                      setShowDatePicker(false);
                      if (event.type !== 'dismissed') {
                        setFieldValue('dob', selectedDate);
                      }
                    }}
                    maximumDate={new Date()}
                  />
                )}

                {/* Contact Number */}
                <TextInput
                  style={[
                    styles.input,
                    touched.contactNumber && errors.contactNumber ? styles.inputError : null,
                  ]}
                  placeholder="Contact Number"
                  placeholderTextColor="#aaa"
                  onChangeText={(text) => {
                    const numericValue = text.replace(/[^0-9]/g, '');
                    if (numericValue.length <= 10) {
                      setFieldValue('contactNumber', numericValue);
                    }
                  }}
                  onBlur={handleBlur('contactNumber')}
                  value={values.contactNumber}
                  keyboardType="numeric"
                  maxLength={10}
                />
                {touched.contactNumber && errors.contactNumber && (
                  <Text style={styles.errorText}>{errors.contactNumber}</Text>
                )}

                {/* Email */}
                <TextInput
                  style={[styles.input, touched.email && errors.email ? styles.inputError : null]}
                  placeholder="Email"
                  placeholderTextColor="#aaa"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                {/* User Type Radio Buttons */}
                <Text style={styles.label}>Who are you?</Text>
                <RadioButtonGroup
                  options={[
                    { label: 'Patient', value: 'Patient' },
                    { label: 'Doctor', value: 'Doctor' },
                  ]}
                  selectedValue={values.userType}
                  onSelect={value => setFieldValue('userType', value)}
                />
                {values.userType === 'Doctor' && (
                  <>
                    <TextInput
                      style={[
                        styles.input,
                        touched.doctorType && errors.doctorType ? styles.inputError : null,
                      ]}
                      placeholder="Specialization (e.g., Cardiologist)"
                      placeholderTextColor="#aaa"
                      onChangeText={handleChange('doctorType')}
                      onBlur={handleBlur('doctorType')}
                      value={values.doctorType}
                    />
                    {touched.doctorType && errors.doctorType && (
                      <Text style={styles.errorText}>{errors.doctorType}</Text>
                    )}
                  </>
                )}

                {/* Gender Radio Buttons */}
                <Text style={styles.label}>Gender</Text>
                <RadioButtonGroup
                  options={[
                    { label: 'Male', value: 'Male' },
                    { label: 'Female', value: 'Female' },
                    { label: 'Other', value: 'Other' },
                  ]}
                  selectedValue={values.gender}
                  onSelect={value => setFieldValue('gender', value)}
                />
                {touched.gender && errors.gender && (
                  <Text style={styles.errorText}>{errors.gender}</Text>
                )}

                {/* Password */}
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[
                      styles.passwordInput,
                      touched.password && errors.password ? styles.inputError : null,
                    ]}
                    placeholder="Password"
                    placeholderTextColor="#aaa"
                    secureTextEntry={!showPassword}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                  />
                  <PasswordVisibilityToggle
                    isVisible={showPassword}
                    onToggle={() => setShowPassword(!showPassword)}
                  />
                </View>
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}

                {/* Confirm Password */}
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[
                      styles.passwordInput,
                      touched.confirmPassword && errors.confirmPassword ? styles.inputError : null,
                    ]}
                    placeholder="Confirm Password"
                    placeholderTextColor="#aaa"
                    secureTextEntry={!showConfirmPassword}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    value={values.confirmPassword}
                  />
                  <PasswordVisibilityToggle
                    isVisible={showConfirmPassword}
                    onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                </View>
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}

                {/* Submit Button */}
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSubmit}
                  disabled={isSubmitting || loading}
                >
                  <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>

                {/* Navigation to Login */}
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.contentText}>
                    Already have an account? Go to Login
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            );
          }}
        </Formik>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;
