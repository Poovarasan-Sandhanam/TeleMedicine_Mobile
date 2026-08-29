import React, { useState } from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
  Text,
  Image,
} from 'react-native';
import { Input, Button } from 'react-native-elements';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import { useAppDispatch } from '../../redux/hooks';
import { signup } from '../../redux/slices/authSlice'; // Adjust path to your slice
import styles from '../../styles/authStyles'; // Your styles

const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Full name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  userType: Yup.string().oneOf(['Doctor', 'Patient']).required('Select a role'),
});

interface SignupValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: 'Doctor' | 'Patient' | '';
}

const SignupScreen = ({ navigation }: { navigation: any }) => {
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSignup = async (
    values: SignupValues,
    { resetForm, setSubmitting }: { resetForm: () => void; setSubmitting: (v: boolean) => void }
  ) => {
    try {
      await (dispatch(
        signup({
          fullName: values.name,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
          role: values.userType.toUpperCase() as 'DOCTOR' | 'PATIENT',
        })
      ) as any).unwrap();

      Toast.show({ type: 'success', text1: 'Signup successful!' });
      resetForm();
      setSubmitting(false);
      navigation.replace('Login');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Signup failed',
        text2: typeof error === 'string' ? error : error?.message || 'Unknown error',
      });
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        style={styles.content}
      >
        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            userType: '',
          } as SignupValues}
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
              <Image
                resizeMode="contain"
                style={styles.imagePic}
                source={require('../../asset/register.png')}
              />
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
                  <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
                    <Text style={styles.toggleText}>{showPassword ? 'Hide' : 'Show'}</Text>
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
                  <TouchableOpacity onPress={() => setShowConfirm(prev => !prev)}>
                    <Text style={styles.toggleText}>{showConfirm ? 'Hide' : 'Show'}</Text>
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

              {/* Role selection */}
              <View style={styles.radioGroup}>
                {['Patient', 'Doctor'].map(role => {
                  const selected = values.userType === role;
                  return (
                    <TouchableOpacity
                      key={role}
                      style={[styles.radioOption, selected && styles.radioOptionSelected]}
                      onPress={() => setFieldValue('userType', role)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.radioCircle,
                          selected && styles.radioCircleSelected,
                        ]}
                      />
                      <Text style={styles.radioLabel}>{role}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {touched.userType && errors.userType && (
                <Text style={styles.errorText}>{errors.userType}</Text>
              )}
              <View style={styles.stickyButton}>
                <Button
                  title="Sign Up"
                  loading={isSubmitting}
                  onPress={() => handleSubmit()}
                  buttonStyle={styles.button}
                  titleStyle={styles.buttonTitle}
                  containerStyle={styles.buttonContainer}
                />
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.linkText}>Already have an account? Log in</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;
