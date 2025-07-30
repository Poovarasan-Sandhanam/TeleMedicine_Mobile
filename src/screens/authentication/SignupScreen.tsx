import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import styles from '../../styles/signupStyles';
import DoctorLogo from '../../asset/svgdoc.svg';

const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  userType: Yup.string().oneOf(['Doctor', 'Patient']).required('Select a role'),
});

const SignupScreen = ({ navigation }: { navigation: any }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSignup = async (values: any, { resetForm }: any) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      Toast.show({
        type: 'success',
        text1: 'Signup successful!',
        text2: `Welcome ${values.name}!`,
      });
      resetForm();
      navigation.navigate('Login');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Signup failed',
        text2: 'Something went wrong. Try again.',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            userType: '',
          }}
          validationSchema={SignupSchema}
          onSubmit={handleSignup}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isSubmitting,
            setFieldValue,
          }) => (
            <>
              <ScrollView
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="handled"
              >

                
                <DoctorLogo width={200} height={200} />
                <Input
                  placeholder="Full name"
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  errorMessage={touched.name && errors.name ? errors.name : undefined}
                  inputStyle={styles.inputText}
                />

                <Input
                  placeholder="Email address"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  errorMessage={touched.email && errors.email ? errors.email : undefined}
                  inputStyle={styles.inputText}
                />
<Input
  placeholder="Enter password"
  secureTextEntry={!showPassword}
  rightIcon={
    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
      <Text style={styles.toggleText}>
        {showPassword ? 'Hide' : 'Show'}
      </Text>
    </TouchableOpacity>
  }
  value={values.password}
  onChangeText={handleChange('password')}
  onBlur={handleBlur('password')}
  errorMessage={touched.password && errors.password ? errors.password : undefined}
  inputStyle={styles.inputText}
/>

<Input
  placeholder="Confirm password"
  secureTextEntry={!showConfirm}
  rightIcon={
    <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
      <Text style={styles.toggleText}>
        {showConfirm ? 'Hide' : 'Show'}
      </Text>
    </TouchableOpacity>
  }
  value={values.confirmPassword}
  onChangeText={handleChange('confirmPassword')}
  onBlur={handleBlur('confirmPassword')}
  errorMessage={
    touched.confirmPassword && errors.confirmPassword
      ? errors.confirmPassword
      : undefined
  }
  inputStyle={styles.inputText}
/>



                <View style={styles.radioGroup}>
                  {['Patient', 'Doctor'].map((role) => (
                    <TouchableOpacity
                      key={role}
                      style={styles.radioOption}
                      onPress={() => setFieldValue('userType', role)}
                    >
                      <View
                        style={[
                          styles.radioOuter,
                          values.userType === role && styles.radioOuterSelected,
                        ]}
                      >
                        {values.userType === role && <View style={styles.radioInner} />}
                      </View>
                      <Text style={styles.radioLabel}>{role}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {touched.userType && errors.userType && (
                  <Text style={styles.errorText}>{errors.userType}</Text>
                )}
                <Button
                  title="Sign Up"
                  loading={isSubmitting}
                  onPress={() => handleSubmit()}
                  containerStyle={styles.stickyButton}
                />
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.linkText}>Already have an account? Log in</Text>
                </TouchableOpacity>
              </ScrollView>


            </>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;
