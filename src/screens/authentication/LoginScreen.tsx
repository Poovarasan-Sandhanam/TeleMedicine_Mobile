import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
  Text,
  Image,
} from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import styles from '../../styles/authStyles';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
});

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (values: any, { setSubmitting }: any) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      Toast.show({
        type: 'success',
        text1: 'Login successful',
        text2: `Welcome back, ${values.email}`,
      });

      setSubmitting(false);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Login failed',
        text2: 'Invalid credentials',
      });
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleLogin}
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
              <ScrollView
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="handled"
              >
                <Image resizeMode={'contain'} style={styles.imagePic} source={require('../../asset/doctor.png')} />
                <Input
                  placeholder="Email address"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  errorMessage={touched.email && errors.email ? errors.email : undefined}
                  inputStyle={styles.inputText}
                />

                <Input
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  rightIcon={
                    <Icon
                      type="material"
                      name={showPassword ? 'visibility' : 'visibility-off'}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  errorMessage={touched.password && errors.password ? errors.password : undefined}
                  inputStyle={styles.inputText}
                />

                <Button
                  title="Log In"
                  loading={isSubmitting}
                  onPress={() => handleSubmit()}
                  buttonStyle={styles.button}
                  titleStyle={styles.buttonTitle}
                  containerStyle={styles.buttonContainer}
                />


                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                  <Text style={styles.linkText}>Don't have an account? Sign up</Text>
                </TouchableOpacity>
              </ScrollView>

              {/* ✅ Sticky bottom button */}

            </>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
