import React, { useEffect, useState, useCallback } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

import SplashScreen from '../utilis/splash';
import OnboardScreen from '../utilis/onboard';
import LoginScreen from '../screens/authentication/LoginScreen';
import SignupScreen from '../screens/authentication/SignupScreen';
import AppointmentBooking from '../screens/booking/AppointmentBooking';
import MyBooking from '../screens/booking/MyBooking';
import ProfileScreen from '../screens/profile/ProfileScreen';
import ConsultScreen from '../screens/consult/ConsultScreen';
import PatientListScreen from '../screens/role/PatientListScreen';
import DoctorSearchScreen from '../screens/role/DoctorSearchScreen';
import DoctorPrescriptionScreen from '../screens/prescription/DoctorPrescriptionScreen';
import DoctorPayment from '../screens/payment/DoctorPayment';
import PaitentPayment from '../screens/payment/PaitentPayment';
import PaitentPrescriptionScreen from '../screens/prescription/PaitentPrescriptionScreen';

import { login } from '../redux/slices/authSlice';
import COLORS from "../constants/colors";
import CustomDrawerContent from '../components/CustomDrawerContent';

// Type definitions
type RootStackParamList = {
  Splash: undefined;
  Onboard: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  AppointmentBooking: { doctorId?: string };
  MyBooking: undefined;
  Payment: undefined;
  Prescription: undefined;
};

type TabParamList = {
  Patients: undefined;
  Doctors: undefined;
  Consult: undefined;
  Payment: undefined;
  MyBooking: undefined;
  Prescription: undefined;
};

type DrawerParamList = {
  Tabs: undefined;
  Profile: undefined;
  Consult: undefined;
  MyBooking: undefined;
};

// Navigator instances
const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

interface TabNavigatorProps {
  navigation: any;
}

const TabNavigator: React.FC<TabNavigatorProps> = ({ navigation }) => {
  const [isDoctor, setIsDoctor] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchIsDoctor = async () => {
      try {
        const storedValue = await AsyncStorage.getItem('isDoctor');
        setIsDoctor(storedValue ? JSON.parse(storedValue) : null);
      } catch (error) {
        console.error('Error fetching isDoctor:', error);
        setIsDoctor(null);
      }
    };
    fetchIsDoctor();
  }, []);

  const handleMenuPress = useCallback(() => {
    navigation.openDrawer();
  }, [navigation]);

  if (isDoctor === null) return null;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitle: '',
        headerLeft: () => (
          <TouchableOpacity onPress={handleMenuPress} style={{ marginLeft: 15 }}>
            <Icon name="menu" size={28} color={COLORS.white} />
          </TouchableOpacity>
        ),
        tabBarStyle: { backgroundColor: COLORS.primary },
        tabBarActiveTintColor: COLORS.white,
        tabBarInactiveTintColor: "black",
      }}
    >
      {isDoctor ? (
        <Tab.Screen
          name="Patients"
          component={PatientListScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account-group" color={color} size={size} />
            ),
          }}
        />
      ) : (
        <Tab.Screen
          name="Doctors"
          component={DoctorSearchScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="stethoscope" color={color} size={size} />
            ),
          }}
        />
      )}

      <Tab.Screen
        name="Consult"
        component={ConsultScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="message-video" color={color} size={size} />
          ),
        }}
      />

      {isDoctor ? (
        <Tab.Screen
          name="Payment"
          component={DoctorPayment}
          options={{
            tabBarIcon: ({ color, size }) => <Icon name="payment" color={color} size={size} />,
          }}
        />
      ) : (
        <>
          <Tab.Screen
            name="MyBooking"
            component={MyBooking}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Icon name="bookmark-border" color={color} size={30} />
              ),
            }}
          />
          <Tab.Screen
            name="Prescription"
            component={PaitentPrescriptionScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <FontAwesome name="notes-medical" color={color} size={size} />
              ),
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
};

const DrawerNavigator: React.FC = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{
      drawerStyle: { backgroundColor: COLORS.primary },
      headerShown: false,
    }}
  >
    <Drawer.Screen name="Tabs" component={TabNavigator} />
    <Drawer.Screen name="Profile" component={ProfileScreen} />
    <Drawer.Screen name="Consult" component={ConsultScreen} />
    <Drawer.Screen name="MyBooking" component={MyBooking} />
  </Drawer.Navigator>
);

const AppNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userData = await AsyncStorage.getItem('user');

        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          dispatch(login(parsedUser.email, parsedUser.password) as any);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  if (isAuthenticated === null) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Onboard" 
          component={OnboardScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Signup" 
          component={SignupScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Home" 
          component={DrawerNavigator} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="AppointmentBooking" 
          component={AppointmentBooking} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="MyBooking" 
          component={MyBooking} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Payment" 
          component={PaitentPayment} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Prescription" 
          component={DoctorPrescriptionScreen} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 
