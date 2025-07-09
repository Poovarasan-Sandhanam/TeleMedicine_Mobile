// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome5';
// import { StyleSheet, TouchableOpacity } from 'react-native';

// import SplashScreen from '../utilis/splash';
// import OnboardScreen from '../utilis/onboard';
// import LoginScreen from '../screens/authentication/LoginScreen';
// import SignupScreen from '../screens/authentication/SignupScreen';
// import AppointmentBooking from '../screens/booking/AppointmentBooking';
// import MyBooking from '../screens/booking/MyBooking';
// import ProfileScreen from '../screens/profile/ProfileScreen';
// import ConsultScreen from '../screens/consult/ConsultScreen';
// import PatientListScreen from '../screens/role/PatientListScreen';
// import DoctorSearchScreen from '../screens/role/DoctorSearchScreen';
// import DoctorPrescriptionScreen from '../screens/prescription/DoctorPrescriptionScreen';
// import DoctorPayment from '../screens/payment/DoctorPayment';
// import PaitentPayment from '../screens/payment/PaitentPayment';
// import PaitentPrescriptionScreen from '../screens/prescription/PaitentPrescriptionScreen';

// import { login, logout } from '../redux/actions/authActions';
// import COLORS from "../constants/colors";

// const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();
// const Drawer = createDrawerNavigator();

// const TabNavigator = ({ navigation }) => {
//   const [isDoctor, setIsDoctor] = useState(null);

//   useEffect(() => {
//     const fetchIsDoctor = async () => {
//       try {
//         const storedValue = await AsyncStorage.getItem('isDoctor');
//         setIsDoctor(JSON.parse(storedValue));
//       } catch (error) {
//         console.error('Error fetching isDoctor:', error);
//       }
//     };
//     fetchIsDoctor();
//   }, []);

//   if (isDoctor === null) {
//     return null; // Or a loading spinner
//   }

//   return (
//     <Tab.Navigator
//       screenOptions={({ navigation }) => ({
//         headerShown: true,
//         headerStyle: { backgroundColor: COLORS.primary },
//         headerTintColor: COLORS.white,
//         headerTitle: '',
//         headerLeft: () => (
//           <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginLeft: 15 }}>
//             <Icon name="menu" size={28} color={COLORS.white} />
//           </TouchableOpacity>
//         ),
//         tabBarStyle: { backgroundColor: COLORS.primary },
//         tabBarActiveTintColor: COLORS.white,
//         tabBarInactiveTintColor: COLORS.textLight,
//       })}
//     >
//       {isDoctor ? (
//         <Tab.Screen
//           name="Patients"
//           component={PatientListScreen}
//           options={{
//             tabBarIcon: ({ color, size }) => (
//               <MaterialCommunityIcons name="account-group" color={color} size={size} />
//             ),
//           }}
//         />
//       ) : (
//         <Tab.Screen
//           name="Doctors"
//           component={DoctorSearchScreen}
//           options={{
//             tabBarIcon: ({ color, size }) => (
//               <MaterialCommunityIcons name="stethoscope" color={color} size={size} />
//             ),
//           }}
//         />
//       )}

//       <Tab.Screen
//         name="Consult"
//         component={ConsultScreen}
//         options={{
//           tabBarIcon: ({ color, size }) => (
//             <MaterialCommunityIcons name="message-video" color={color} size={size} />
//           ),
//         }}
//       />

//       {isDoctor && (
//         <Tab.Screen
//           name="Payment"
//           component={DoctorPayment}
//           options={{
//             tabBarIcon: ({ color, size }) => <Icon name="payment" color={color} size={size} />,
//           }}
//         />
//       )}

//       {!isDoctor && (
//         <>
//           <Tab.Screen
//             name="MyBooking"
//             component={MyBooking}
//             options={{
//               tabBarIcon: ({ color, size }) => <Icon name="bookmark-border" color={color} size={30} />,
//             }}
//           />
//           <Tab.Screen
//             name="Prescription"
//             component={PaitentPrescriptionScreen}
//             options={{
//               tabBarIcon: ({ color, size }) => <FontAwesome name="notes-medical" color={color} size={size} />,
//             }}
//           />
//         </>
//       )}
//     </Tab.Navigator>
//   );
// };

// const CustomDrawerContent = (props) => {
//   const dispatch = useDispatch();
//   const [isDoctor, setIsDoctor] = useState(false);

//   useEffect(() => {
//     const fetchIsDoctor = async () => {
//       try {
//         const storedValue = await AsyncStorage.getItem('isDoctor');
//         setIsDoctor(JSON.parse(storedValue));
//       } catch (error) {
//         console.error('Error fetching isDoctor:', error);
//       }
//     };
//     fetchIsDoctor();
//   }, []);

//   const handleLogout = async () => {
//     await AsyncStorage.removeItem('token');
//     await AsyncStorage.removeItem('user');
//     dispatch(logout());
//     props.navigation.navigate('Login');
//   };

//   return (
//     <DrawerContentScrollView {...props} style={{ backgroundColor: COLORS.primary }}>
//       <DrawerItem
//         label="Home"
//         onPress={() => props.navigation.navigate('Tabs')}
//         labelStyle={styles.drawerText}
//       />
//       <DrawerItem
//         label="Profile"
//         onPress={() => props.navigation.navigate('Profile')}
//         labelStyle={styles.drawerText}
//       />
//       {!isDoctor && (
//         <DrawerItem
//           label="My Booking"
//           onPress={() => props.navigation.navigate('MyBooking')}
//           labelStyle={styles.drawerText}
//         />
//       )}
//       <DrawerItem
//         label="Consult"
//         onPress={() => props.navigation.navigate('Consult')}
//         labelStyle={styles.drawerText}
//       />
//       <DrawerItem
//         label="Logout"
//         onPress={handleLogout}
//         style={styles.logoutButton}
//         labelStyle={styles.logoutText}
//       />
//     </DrawerContentScrollView>
//   );
// };

// const DrawerNavigator = () => (
//   <Drawer.Navigator
//     drawerContent={(props) => <CustomDrawerContent {...props} />}
//     screenOptions={{
//       drawerStyle: { backgroundColor: COLORS.primary, width: 250 },
//       headerShown: false,
//     }}
//   >
//     <Drawer.Screen name="Tabs" component={TabNavigator} />
//     <Drawer.Screen name="Profile" component={ProfileScreen} />
//     <Drawer.Screen name="Consult" component={ConsultScreen} />
//     <Drawer.Screen name="MyBooking" component={MyBooking} />
//   </Drawer.Navigator>
// );

// const AppNavigator = () => {
//   const dispatch = useDispatch();
//   const [isAuthenticated, setIsAuthenticated] = useState(null);

//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = await AsyncStorage.getItem('token');
//       const userData = await AsyncStorage.getItem('user');

//       if (token && userData) {
//         const parsedUser = JSON.parse(userData);
//         dispatch(login(parsedUser.email, parsedUser.password));
//         setIsAuthenticated(true);
//       } else {
//         setIsAuthenticated(false);
//       }
//     };
//     checkAuth();
//   }, [dispatch]);

//   if (isAuthenticated === null) {
//     return null; // or a loading spinner
//   }

//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Splash">
//         <Stack.Screen
//           name="Splash"
//           component={SplashScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Onboard"
//           component={OnboardScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Home"
//           component={DrawerNavigator}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Login"
//           component={LoginScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Signup"
//           component={SignupScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="AppointmentBooking"
//           component={AppointmentBooking}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="MyBooking"
//           component={MyBooking}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Payment"
//           component={PaitentPayment}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Prescription"
//           component={DoctorPrescriptionScreen}
//           options={{ headerShown: false }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// const styles = StyleSheet.create({
//   logoutButton: {
//     marginTop: 20,
//   },
//   logoutText: {
//     color: 'red',
//     fontWeight: 'bold',
//   },
//   drawerText: {
//     color:"white",
//     fontWeight: 'bold',
//   },
// });

// export default AppNavigator;


import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

import { login, logout } from '../redux/actions/authActions';
import COLORS from "../constants/colors";
import CustomDrawerContent from '../components/CustomDrawerContent'; // ← Your enhanced drawer content here

// Navigator instances
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const TabNavigator = ({ navigation }) => {
  const [isDoctor, setIsDoctor] = useState(null);

  useEffect(() => {
    const fetchIsDoctor = async () => {
      try {
        const storedValue = await AsyncStorage.getItem('isDoctor');
        setIsDoctor(JSON.parse(storedValue));
      } catch (error) {
        console.error('Error fetching isDoctor:', error);
      }
    };
    fetchIsDoctor();
  }, []);

  if (isDoctor === null) return null;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitle: '',
        headerLeft: () => (
          <Icon
            name="menu"
            size={28}
            color={COLORS.white}
            style={{ marginLeft: 15 }}
            onPress={() => navigation.openDrawer()}
          />
        ),
        tabBarStyle: { backgroundColor: COLORS.primary },
        tabBarActiveTintColor: COLORS.white,
        tabBarInactiveTintColor: COLORS.textLight,
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

const DrawerNavigator = () => (
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

const AppNavigator = () => {
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userData = await AsyncStorage.getItem('user');

        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          dispatch(login(parsedUser.email, parsedUser.password));
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
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Onboard" component={OnboardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={DrawerNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="AppointmentBooking" component={AppointmentBooking} options={{ headerShown: false }} />
        <Stack.Screen name="MyBooking" component={MyBooking} options={{ headerShown: false }} />
        <Stack.Screen name="Payment" component={PaitentPayment} options={{ headerShown: false }} />
        <Stack.Screen name="Prescription" component={DoctorPrescriptionScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

