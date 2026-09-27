import React, { useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppDispatch } from '../../redux/hooks';
import { signup } from '../../redux/slices/authSlice';
import { useTheme, radius, space } from '../../theme';
import { AppText, Button, IconButton, PressScale, TextField } from '../../ui';
import { AuthLayout } from './AuthLayout';

const SignupSchema = Yup.object().shape({
  name: Yup.string().trim().min(2, 'At least 2 characters').required('Full name is required'),
  email: Yup.string().trim().email('Enter a valid email').required('Email is required'),
  password: Yup.string().min(6, 'At least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  userType: Yup.string().oneOf(['Doctor', 'Patient']).required('Choose how you will use the app'),
});

interface SignupValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: 'Doctor' | 'Patient' | '';
}

const ROLES = [
  { key: 'Patient' as const, icon: 'person', title: 'Patient', hint: 'Find doctors & book' },
  { key: 'Doctor' as const, icon: 'medkit', title: 'Doctor', hint: 'See patients & prescribe' },
];

const RoleCard: React.FC<{ role: typeof ROLES[number]; selected: boolean; onPress: () => void }> = ({ role, selected, onPress }) => {
  const { colors } = useTheme();
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${role.title}: ${role.hint}`}
      style={[
        styles.role,
        { borderColor: selected ? colors.primary : colors.border, backgroundColor: selected ? colors.primarySoft : colors.surfaceAlt },
      ]}
    >
      <View style={[styles.roleIcon, { backgroundColor: selected ? colors.primary : colors.surface }]}>
        <Icon name={selected ? role.icon : `${role.icon}-outline`} size={22} color={selected ? colors.onPrimary : colors.textMuted} />
      </View>
      <AppText variant="bodyStrong" style={styles.roleTitle}>{role.title}</AppText>
      <AppText variant="caption" color="textMuted">{role.hint}</AppText>
      {selected ? (
        <View style={[styles.check, { backgroundColor: colors.primary }]}>
          <Icon name="checkmark" size={12} color={colors.onPrimary} />
        </View>
      ) : null}
    </PressScale>
  );
};

const SignupScreen = ({ navigation }: { navigation: any }) => {
  const dispatch = useAppDispatch();
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const handleSignup = async (values: SignupValues, { setSubmitting }: any) => {
    try {
      await (dispatch(
        signup({
          fullName: values.name.trim(),
          email: values.email.trim(),
          password: values.password,
          confirmPassword: values.confirmPassword,
          role: values.userType.toUpperCase() as 'DOCTOR' | 'PATIENT',
        }),
      ) as any).unwrap();
      Toast.show({ type: 'success', text1: 'Account created', text2: 'Sign in to get started.' });
      navigation.replace('Login');
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Could not create account', text2: typeof error === 'string' ? error : error?.message || 'Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join in under a minute"
      headerLeft={<IconButton icon="chevron-back" glass label="Back" onPress={() => navigation.goBack()} />}
      footer={
        <PressScale onPress={() => navigation.navigate('Login')} accessibilityRole="button" accessibilityLabel="Sign in instead">
          <AppText variant="body" color="textMuted">
            Already have an account? <AppText variant="bodyStrong" color="primary">Sign in</AppText>
          </AppText>
        </PressScale>
      }
    >
      <Formik
        initialValues={{ name: '', email: '', password: '', confirmPassword: '', userType: '' } as SignupValues}
        validationSchema={SignupSchema}
        onSubmit={handleSignup}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting, setFieldValue }) => (
          <>
            <AppText variant="label" color="textMuted" style={styles.sectionLabel}>I am a</AppText>
            <View style={styles.roles} accessibilityRole="radiogroup">
              {ROLES.map(role => (
                <RoleCard key={role.key} role={role} selected={values.userType === role.key} onPress={() => setFieldValue('userType', role.key)} />
              ))}
            </View>
            {touched.userType && errors.userType ? (
              <AppText variant="caption" color="danger" style={styles.roleError}>{errors.userType}</AppText>
            ) : null}

            <TextField
              label="Full name" icon="person-outline" placeholder="Jane Doe"
              value={values.name} onChangeText={handleChange('name')} onBlur={handleBlur('name')}
              textContentType="name" returnKeyType="next" onSubmitEditing={() => emailRef.current?.focus()}
              error={touched.name ? errors.name : null}
            />
            <TextField
              ref={emailRef} label="Email" icon="mail-outline" placeholder="you@example.com"
              value={values.email} onChangeText={handleChange('email')} onBlur={handleBlur('email')}
              autoCapitalize="none" autoCorrect={false} keyboardType="email-address" textContentType="emailAddress"
              returnKeyType="next" onSubmitEditing={() => passwordRef.current?.focus()}
              error={touched.email ? errors.email : null}
            />
            <TextField
              ref={passwordRef} label="Password" icon="lock-closed-outline" placeholder="At least 6 characters" secureToggle
              value={values.password} onChangeText={handleChange('password')} onBlur={handleBlur('password')}
              textContentType="newPassword" returnKeyType="next" onSubmitEditing={() => confirmRef.current?.focus()}
              error={touched.password ? errors.password : null}
            />
            <TextField
              ref={confirmRef} label="Confirm password" icon="shield-checkmark-outline" placeholder="Repeat your password" secureToggle
              value={values.confirmPassword} onChangeText={handleChange('confirmPassword')} onBlur={handleBlur('confirmPassword')}
              textContentType="newPassword" returnKeyType="go" onSubmitEditing={() => handleSubmit()}
              error={touched.confirmPassword ? errors.confirmPassword : null}
            />
            <Button title="Create account" icon="sparkles" loading={isSubmitting} onPress={() => handleSubmit()} style={styles.cta} />
          </>
        )}
      </Formik>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  sectionLabel: { marginBottom: space.xs, marginLeft: 2 },
  roles: { flexDirection: 'row', gap: space.sm, marginBottom: space.md },
  role: { flex: 1, borderWidth: 1.5, borderRadius: radius.lg, padding: space.md },
  roleIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: space.sm },
  roleTitle: { marginBottom: 2 },
  check: { position: 'absolute', top: 10, right: 10, width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  roleError: { marginTop: -space.xs, marginBottom: space.sm, marginLeft: 2 },
  cta: { marginTop: space.xs },
});

export default SignupScreen;
