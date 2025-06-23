// src/screens/LoginScreen.js

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import { login } from '../../redux/actions/authActions';
import PasswordVisibilityToggle from '../../components/PasswordVisibilityToggle';
import LoadingSpinner from '../../components/LoadingSpinner';
import styles from '../../styles/loginStyles';
import LoginSchema from '../../validation/loginSchema';

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user, error, loading } = useSelector(state => state.auth);
  const [showPassword, setShowPassword] = useState(false);

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
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', margin: 15 }}>
          <LoadingSpinner visible={loading} />
          <Text style={styles.title}>Login your account :)</Text>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={async (values) => {
              await dispatch(login(values.email, values.password));
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
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
                  />
                  <PasswordVisibilityToggle
                    isVisible={showPassword}
                    onToggle={() => setShowPassword(!showPassword)}
                  />
                </View>
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}

                {error && <Text style={styles.errorText}>{error}</Text>}

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
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
