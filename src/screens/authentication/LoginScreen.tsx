import React, { useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppDispatch } from '../../redux/hooks';
import { login } from '../../redux/slices/authSlice';
import { markOnboarded } from '../../session/session';
import { AppText, Button, PressScale, TextField } from '../../ui';
import { space } from '../../theme';
import { AuthLayout } from './AuthLayout';

const LoginSchema = Yup.object().shape({
  email: Yup.string().trim().email('Enter a valid email').required('Email is required'),
  password: Yup.string().min(6, 'At least 6 characters').required('Password is required'),
});

const LoginScreen = ({ navigation }: { navigation: any }) => {
  const dispatch = useAppDispatch();
  const passwordRef = useRef<TextInput>(null);

  const handleLogin = async (values: { email: string; password: string }, { setSubmitting }: any) => {
    try {
      const user = await (dispatch(login({ email: values.email.trim(), password: values.password }) as any)).unwrap();
      markOnboarded();
      Toast.show({ type: 'success', text1: `Welcome back${user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}` });
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Sign in failed', text2: typeof error === 'string' ? error : 'Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your care"
      badge={
        <View style={styles.badge}>
          <Icon name="pulse" size={30} color="#FFFFFF" />
        </View>
      }
      footer={
        <PressScale onPress={() => navigation.navigate('Signup')} accessibilityRole="button" accessibilityLabel="Create an account">
          <AppText variant="body" color="textMuted">
            New here? <AppText variant="bodyStrong" color="primary">Create an account</AppText>
          </AppText>
        </PressScale>
      }
    >
      <Formik initialValues={{ email: '', password: '' }} validationSchema={LoginSchema} onSubmit={handleLogin}>
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
          <>
            <TextField
              label="Email"
              icon="mail-outline"
              placeholder="you@example.com"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              error={touched.email ? errors.email : null}
            />
            <TextField
              ref={passwordRef}
              label="Password"
              icon="lock-closed-outline"
              placeholder="Your password"
              secureToggle
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={() => handleSubmit()}
              error={touched.password ? errors.password : null}
            />
            <Button
              title="Sign in"
              icon="arrow-forward"
              loading={isSubmitting}
              onPress={() => handleSubmit()}
              style={styles.cta}
              testID="login-submit"
            />
          </>
        )}
      </Formik>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  badge: {
    width: 60, height: 60, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)',
  },
  cta: { marginTop: space.xs },
});

export default LoginScreen;
