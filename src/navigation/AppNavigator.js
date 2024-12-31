import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Vector Icon for toggling
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // For tab icons
import LoginScreen from '../screens/authentication/LoginScreen';
import SignupScreen from '../screens/authentication/SignupScreen';
import HomeScreen from '../screens/dashboard/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import ConsultScreen from '../screens/consult/ConsultScreen';
import PatientListScreen from '../screens/role/PatientListScreen';
import DoctorSearchScreen from '../screens/role/DoctorSearchScreen';
import { login, logout } from '../redux/actions/authActions'; // Adjust the path as needed
import { StyleSheet, TouchableOpacity } from 'react-native';
import COLORS from '../utilis/colors';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const TabNavigator = ({ navigation }) => {
  const [isDoctor, setIsDoctor] = useState(null); // State to store `isDoctor` value

  // Fetch `isDoctor` from AsyncStorage
  useEffect(() => {
    const fetchIsDoctor = async () => {
      try {
        const storedValue = await AsyncStorage.getItem('isDoctor');
        setIsDoctor(JSON.parse(storedValue)); // Parse boolean from string
      } catch (error) {
        console.error('Error fetching isDoctor:', error);
      }
    };

    fetchIsDoctor();
  }, []);

  if (isDoctor === null) {
    return null; // Optionally show a loading spinner here while fetching data
  }

  return (
<Tab.Navigator
  screenOptions={({navigation}) => ({
    headerShown: true,
    headerStyle: { backgroundColor:COLORS.primary },
    headerTintColor: '#fff',
    headerTitle: '',
    headerLeft: () => (
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Icon name="menu" size={28} color="#fff" style={{ marginLeft: 15 }} />
      </TouchableOpacity>
    ),
    tabBarStyle: { backgroundColor:COLORS.primary },
    tabBarActiveTintColor:COLORS.black,
    tabBarInactiveTintColor:COLORS.white
  })}
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
</Tab.Navigator>
  );
};


const CustomDrawerContent = (props) => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token'); // Remove token from storage
    await AsyncStorage.removeItem('user');  // Remove user data from storage
    dispatch(logout());                     // Dispatch the logout action
    props.navigation.navigate('Login');     // Navigate to Login screen
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Home"
        onPress={() => props.navigation.navigate('Tabs')}
        labelStyle={styles.drawerText}
      />
      <DrawerItem
        label="Profile"
        onPress={() => props.navigation.navigate('Profile')}
        labelStyle={styles.drawerText}
      />
      <DrawerItem
        label="Consult"
        onPress={() => props.navigation.navigate('Consult')}
        labelStyle={styles.drawerText}
      />
      <DrawerItem
        label="Logout"
        onPress={handleLogout}
        style={styles.logoutButton}
        labelStyle={styles.logoutText}
      />
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{
      drawerStyle: { backgroundColor: COLORS.primary, width: 250 },
      headerShown: false,
    }}
  >
    <Drawer.Screen name="Tabs" component={TabNavigator} />
    <Drawer.Screen name="Profile" component={ProfileScreen} />
    <Drawer.Screen name="Consult" component={ConsultScreen} />
  </Drawer.Navigator>
);

const AppNavigator = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('user'); // Retrieve the user data

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        dispatch(login(parsedUser.email, parsedUser.password)); // Dispatch login action with credentials
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  if (isAuthenticated === null) {
    return null; // You can return a loading spinner here while checking auth
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isAuthenticated ? 'Home' : 'Login'}>
        <Stack.Screen
          name="Home"
          component={DrawerNavigator}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  logoutButton: {
    marginTop: 20,
  },
  logoutText: {
    color: 'Red',
    fontWeight: 'bold',
  },
  drawerText: {
    color:COLORS.white,
    fontWeight: 'bold',
  },
});

export default AppNavigator;
