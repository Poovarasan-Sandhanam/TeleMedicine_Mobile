import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { signup } from '../../redux/slices/authSlice';
import styles from '../../styles/signupStyles';

// Validation Schema
const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
  userType: Yup.string().oneOf(['Doctor', 'Patient']).required('User type is required'),
});

// Types
interface SignupFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: 'Doctor' | 'Patient';
}

const SignupScreen = ({ navigation }: { navigation: any }) => {
  const dispatch = useAppDispatch();
  const { loading, error, user } = useAppSelector((state) => state.auth);

  const handleSignup = useCallback(
    async (values: SignupFormData, { resetForm }: FormikHelpers<SignupFormData>) => {
      try {
        const payload = {
          fullName: values.name,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
          role: values.userType.toUpperCase() as 'DOCTOR' | 'PATIENT',
        };

        const result = await dispatch(signup(payload) as any).unwrap();

        Toast.show({
          type: 'success',
          text1: 'Signup Successful 🎉',
          text2: 'Welcome aboard!',
        });

        resetForm();
        
        // If signup automatically logs in the user, navigate to home
        // Otherwise, navigate to login
        if (user) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        } else {
          navigation.navigate('Login');
        }
      } catch (err: any) {
        Toast.show({
          type: 'error',
          text1: 'Signup Failed',
          text2: err?.message || 'Something went wrong.',
        });
      }
    },
    [dispatch, navigation, user]
  );

  // Navigate to home if user is already logged in
  useEffect(() => {
    if (user) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    }
  }, [user, navigation]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Sign Up</Text>

          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
              confirmPassword: '',
              userType: 'Patient',
            }}
            validationSchema={SignupSchema}
            onSubmit={handleSignup}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
              <>
                <TextInput
                  style={[styles.input, touched.name && errors.name && styles.inputError]}
                  placeholder="Full Name"
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                />
                {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

                <TextInput
                  style={[styles.input, touched.email && errors.email && styles.inputError]}
                  placeholder="Email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                />
                {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                <TextInput
                  style={[styles.input, touched.password && errors.password && styles.inputError]}
                  placeholder="Password"
                  secureTextEntry
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                />
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}

                <TextInput
                  style={[
                    styles.input,
                    touched.confirmPassword && errors.confirmPassword && styles.inputError,
                  ]}
                  placeholder="Confirm Password"
                  secureTextEntry
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}

                {/* User Type */}
                <Text style={styles.label}>I am a:</Text>
                <View style={styles.radioGroup}>
                  {['Patient', 'Doctor'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={styles.radioOption}
                      onPress={() => setFieldValue('userType', type)}
                    >
                      <View
                        style={[
                          styles.radioButton,
                          values.userType === type && styles.radioSelected,
                        ]}
                      />
                      <Text style={styles.radioLabel}>{type}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {touched.userType && errors.userType && (
                  <Text style={styles.errorText}>{errors.userType}</Text>
                )}

                {error && <Text style={styles.errorText}>{error}</Text>}

                <TouchableOpacity 
                  style={[styles.button, loading && styles.buttonDisabled]} 
                  onPress={() => handleSubmit()}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>
                    {loading ? 'Creating Account...' : 'Sign Up'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.contentText}>Already have an account? Login</Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;
