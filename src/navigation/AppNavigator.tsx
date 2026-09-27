import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { DarkTheme, DefaultTheme, NavigationContainer, Theme as NavTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabBarProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import SplashScreen from '../utilis/splash';
import OnboardScreen from '../utilis/onboard';
import LoginScreen from '../screens/authentication/LoginScreen';
import SignupScreen from '../screens/authentication/SignupScreen';
import AppointmentBooking from '../screens/booking/AppointmentBooking';
import MyBooking from '../screens/booking/MyBooking';
import ProfileScreen from '../screens/profile/ProfileScreen';
import PatientListScreen from '../screens/role/PatientListScreen';
import DoctorListScreen from '../screens/role/DoctorListScreen';
import DoctorSearchScreen from '../screens/role/DoctorSearchScreen';
import DoctorPrescriptionScreen from '../screens/prescription/DoctorPrescriptionScreen';
import PaitentPrescriptionScreen from '../screens/prescription/PaitentPrescriptionScreen';

import { useAppDispatch } from '../redux/hooks';
import { LOGOUT } from '../redux/store';
import { setUnauthorizedHandler } from '../utilis/api';
import { clearSession } from '../session/session';
import { PreviewArgs, signInForPreview } from '../dev/preview';
import { useTheme, fonts } from '../theme';
import { FloatingTabBar } from './FloatingTabBar';
import { navigationRef, resetTo } from './navigationRef';

export type RootStackParamList = {
  Splash: undefined;
  Onboard: undefined;
  Login: undefined;
  Signup: undefined;
  Home: { screen?: string } | undefined;
  AppointmentBooking: { doctor?: any };
  DoctorListScreen: { category?: string };
  WritePrescription: { appointmentId: string; patientName?: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Defined once at module level so the tab bar is not a new component each render.
const renderTabBar = (props: BottomTabBarProps) => <FloatingTabBar {...props} />;

/**
 * Patients: Home, Bookings, Prescriptions, Profile.
 * Doctors: Schedule, Bookings, Profile.
 *
 * The previous side drawer only duplicated these and held logout, which now
 * lives on the Profile tab. Consult is not shown until video calling exists -
 * its screen only displayed "Connecting..." and never connected.
 */
const HomeTabs: React.FC = () => {
  const [isDoctor, setIsDoctor] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('isDoctor')
      .then(v => setIsDoctor(v ? JSON.parse(v) === true : false))
      .catch(() => setIsDoctor(false));
  }, []);

  // Wait for the role so a doctor never sees the patient tabs flash first.
  if (isDoctor === null) {
    return null;
  }

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={renderTabBar}>
      {isDoctor ? (
        <Tab.Screen name="Patients" component={PatientListScreen} />
      ) : (
        <Tab.Screen name="Doctors" component={DoctorSearchScreen} />
      )}
      <Tab.Screen name="MyBooking" component={MyBooking} />
      {!isDoctor ? <Tab.Screen name="Prescription" component={PaitentPrescriptionScreen} /> : null}
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

let signingOut = false;

const AppNavigator: React.FC<{ preview?: PreviewArgs }> = ({ preview = {} }) => {
  const dispatch = useAppDispatch();
  const { colors, isDark } = useTheme();
  const isPreview = !!(preview.screen || preview.tab || preview.login);
  const [ready, setReady] = useState(!isPreview);

  // An expired or revoked token anywhere in the app returns the user to sign-in.
  useEffect(() => {
    setUnauthorizedHandler(async () => {
      if (signingOut) {
        return;
      }
      signingOut = true;
      await clearSession();
      dispatch({ type: LOGOUT });
      resetTo('Login');
      Toast.show({ type: 'info', text1: 'Session expired', text2: 'Please sign in again.' });
      setTimeout(() => { signingOut = false; }, 1500);
    });
    return () => setUnauthorizedHandler(null);
  }, [dispatch]);

  useEffect(() => {
    if (!isPreview) {
      return;
    }
    (async () => {
      if (preview.login) {
        await signInForPreview(preview.login);
      } else {
        await clearSession();
      }
      setReady(true);
    })();
  }, [isPreview, preview.login]);

  const navTheme: NavTheme = useMemo(() => {
    const base = isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      dark: isDark,
      colors: {
        ...base.colors,
        primary: colors.primary,
        background: colors.bg,
        card: colors.surface,
        text: colors.text,
        border: colors.border,
        notification: colors.danger,
      },
      fonts: {
        regular: { fontFamily: fonts.regular, fontWeight: '400' },
        medium: { fontFamily: fonts.medium, fontWeight: '500' },
        bold: { fontFamily: fonts.bold, fontWeight: '700' },
        heavy: { fontFamily: fonts.extrabold, fontWeight: '800' },
      },
    };
  }, [colors, isDark]);

  if (!ready) {
    return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  }

  const initialRoute: keyof RootStackParamList = !isPreview
    ? 'Splash'
    : preview.login
      ? 'Home'
      : ((preview.screen as keyof RootStackParamList) ?? 'Login');

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={navTheme}
      onReady={() => {
        if (!isPreview || !preview.login) {
          return;
        }
        if (preview.tab) {
          navigationRef.navigate('Home', { screen: preview.tab });
        }
        if (preview.screen && preview.screen !== 'Home') {
          navigationRef.navigate(preview.screen, preview.params);
        }
      }}
    >
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Onboard" component={OnboardScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeTabs} options={{ animation: 'fade' }} />
        <Stack.Screen name="AppointmentBooking" component={AppointmentBooking} />
        <Stack.Screen name="DoctorListScreen" component={DoctorListScreen} />
        <Stack.Screen name="WritePrescription" component={DoctorPrescriptionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
