import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../constants/colors'; // Your color constants

const CustomDrawerContent = (props) => {
  const dispatch = useDispatch();
  const [isDoctor, setIsDoctor] = useState(false);
  const [user, setUser] = useState({ name: 'Guest User', email: 'guest@example.com', avatar: null });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const isDoctorValue = await AsyncStorage.getItem('isDoctor');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser({
            name: parsedUser.name || parsedUser.email,
            email: parsedUser.email,
            avatar: parsedUser.avatar || null, // URL or local path
          });
        }
        setIsDoctor(JSON.parse(isDoctorValue));
      } catch (e) {
        console.error('Error loading drawer user data:', e);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' }); // Or your logout action
    props.navigation.navigate('Login');
  };

  return (
    <View style={styles.drawerContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={
            user.avatar
              ? { uri: user.avatar }
              : require("../asset/profile.png") // fallback avatar
          }
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* Navigation Items */}
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
        <DrawerItem
          label="Home"
          labelStyle={styles.drawerLabel}
          icon={({ color, size }) => <Icon name="home" color={color} size={size} />}
          onPress={() => props.navigation.navigate('Tabs')}
          activeTintColor={COLORS.accent}
          inactiveTintColor={COLORS.white}
          style={styles.drawerItem}
        />
        <DrawerItem
          label="Profile"
          labelStyle={styles.drawerLabel}
          icon={({ color, size }) => <Icon name="person" color={color} size={size} />}
          onPress={() => props.navigation.navigate('Profile')}
          activeTintColor={COLORS.accent}
          inactiveTintColor={COLORS.white}
          style={styles.drawerItem}
        />
        {!isDoctor && (
          <DrawerItem
            label="My Booking"
            labelStyle={styles.drawerLabel}
            icon={({ color, size }) => <Icon name="bookmark-border" color={color} size={size} />}
            onPress={() => props.navigation.navigate('MyBooking')}
            activeTintColor={COLORS.accent}
            inactiveTintColor={COLORS.white}
            style={styles.drawerItem}
          />
        )}
        <DrawerItem
          label="Consult"
          labelStyle={styles.drawerLabel}
          icon={({ color, size }) => <MaterialCommunityIcons name="message-video" color={color} size={size} />}
          onPress={() => props.navigation.navigate('Consult')}
          activeTintColor={COLORS.accent}
          inactiveTintColor={COLORS.white}
          style={styles.drawerItem}
        />
      </DrawerContentScrollView>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Icon name="logout" size={22} color={COLORS.red} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>App Version 1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  header: {
    marginTop:40,
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.accentLight,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  name: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    color: COLORS.secondary,
    fontSize: 14,
    marginTop: 2,
  },
  drawerContent: {
    paddingTop: 10,
  },
  drawerItem: {
    marginVertical: 0,
  },
  drawerLabel: {
    color: COLORS.white,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.accentLight,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  logoutText: {
    color: COLORS.red,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 15,
  },
  footer: {
    padding: 15,
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.textLight,
    fontSize: 12,
  },
});

export default CustomDrawerContent;
