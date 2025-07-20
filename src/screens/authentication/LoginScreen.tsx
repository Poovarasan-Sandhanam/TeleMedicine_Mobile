// src/screens/LoginScreen.js

import React, { useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { Formik, FormikHelpers } from 'formik';
import { login } from '../../redux/slices/authSlice';
import PasswordVisibilityToggle from '../../components/PasswordVisibilityToggle';
import LoadingSpinner from '../../components/LoadingSpinner';
import styles from '../../styles/loginStyles';
import LoginSchema, { LoginFormData } from '../../validation/loginSchema';

interface LoginScreenProps {
  navigation: {
    reset: (config: { index: number; routes: Array<{ name: string }> }) => void;
    navigate: (screen: string) => void;
  };
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user, error, loading } = useAppSelector((state: any) => state.auth);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handlePasswordToggle = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const handleSignupNavigation = useCallback(() => {
    navigation.navigate('Signup');
  }, [navigation]);

  const handleSubmit = useCallback(async (values: LoginFormData, { setSubmitting }: FormikHelpers<LoginFormData>) => {
    try {
      await dispatch(login({ email: values.email, password: values.password }));
    } catch (err) {
      Alert.alert('Login Error', 'Failed to login. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    }
  }, [user, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', margin: 15 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <LoadingSpinner visible={loading} />
          <Text style={styles.title}>Login your account :)</Text>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleSubmit}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
            }) => (
              <>
                <TextInput
                  style={[styles.input, touched.email && errors.email ? styles.inputError : null]}
                  placeholder="Email"
                  placeholderTextColor="#999"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  textContentType="emailAddress"
                />
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[
                      styles.passwordInput,
                      touched.password && errors.password ? styles.inputError : null,
                    ]}
                    placeholder="Password"
                    placeholderTextColor="#999"
                    secureTextEntry={!showPassword}
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    autoComplete="password"
                    textContentType="password"
                  />
                  <PasswordVisibilityToggle
                    isVisible={showPassword}
                    onToggle={handlePasswordToggle}
                  />
                </View>
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}

                {error && <Text style={styles.errorText}>{error}</Text>}

                <TouchableOpacity 
                  style={[styles.button, isSubmitting && styles.buttonDisabled]} 
                  onPress={() => handleSubmit()}
                  disabled={isSubmitting}
                  activeOpacity={0.8}
                >
                  <Text style={styles.buttonText}>
                    {isSubmitting ? 'Logging in...' : 'Login'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleSignupNavigation} activeOpacity={0.7}>
                  <Text style={styles.contentText}>New user? Go to Signup</Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
