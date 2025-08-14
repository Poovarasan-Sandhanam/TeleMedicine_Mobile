import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItem, DrawerContentComponentProps } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../constants/colors';
import { RootState } from '../redux/store';
import { fetchProfile, initializeLocalProfile } from '../redux/slices/profileSlice';

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const dispatch = useDispatch();

  const profile = useSelector((state: RootState) => state.profile.profile);
  const isDoctor = profile?.isDoctor || false;

  // Load profile on mount
  useEffect(() => {
    dispatch(initializeLocalProfile()); // load local AsyncStorage profile first
    dispatch(fetchProfile()); // fetch fresh profile from API
  }, [dispatch]);

  const handleLogout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' }); // reset Redux state if you have a logout reducer
      props.navigation.navigate('Login' as never);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, [dispatch, props.navigation]);

  const handleNavigation = useCallback((screen: string) => {
    props.navigation.navigate(screen as never);
  }, [props.navigation]);

  const user = profile
    ? {
        name: profile.name || profile.email,
        email: profile.email,
        avatar: profile.profileImage || null,
      }
    : { name: 'Guest User', email: 'guest@example.com', avatar: null };

  return (
    <View style={styles.drawerContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={
            user.avatar
              ? { uri: user.avatar }
              : require("../asset/profile.png")
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
          onPress={() => handleNavigation('Tabs')}
          activeTintColor={COLORS.secondary}
          inactiveTintColor={COLORS.white}
          style={styles.drawerItem}
        />
        <DrawerItem
          label="Profile"
          labelStyle={styles.drawerLabel}
          icon={({ color, size }) => <Icon name="person" color={color} size={size} />}
          onPress={() => handleNavigation('Profile')}
          activeTintColor={COLORS.secondary}
          inactiveTintColor={COLORS.white}
          style={styles.drawerItem}
        />
        {!isDoctor && (
          <DrawerItem
            label="My Booking"
            labelStyle={styles.drawerLabel}
            icon={({ color, size }) => <Icon name="bookmark-border" color={color} size={size} />}
            onPress={() => handleNavigation('MyBooking')}
            activeTintColor={COLORS.secondary}
            inactiveTintColor={COLORS.white}
            style={styles.drawerItem}
          />
        )}
        <DrawerItem
          label="Consult"
          labelStyle={styles.drawerLabel}
          icon={({ color, size }) => <MaterialCommunityIcons name="message-video" color={color} size={size} />}
          onPress={() => handleNavigation('Consult')}
          activeTintColor={COLORS.secondary}
          inactiveTintColor={COLORS.white}
          style={styles.drawerItem}
        />
      </DrawerContentScrollView>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
        <Icon name="logout" size={22} color={COLORS.error} />
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
  drawerContainer: { flex: 1, backgroundColor: COLORS.primary },
  header: {
    marginTop: 40,
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 10, borderWidth: 2, borderColor: COLORS.secondary },
  name: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  email: { color: COLORS.secondary, fontSize: 14, marginTop: 2 },
  drawerContent: { paddingTop: 10 },
  drawerItem: { marginVertical: 0 },
  drawerLabel: { color: COLORS.white, fontWeight: '600' },
  divider: { height: 1, backgroundColor: COLORS.border, marginHorizontal: 20, marginVertical: 10 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20 },
  logoutText: { color: COLORS.error, fontWeight: 'bold', fontSize: 16, marginLeft: 15 },
  footer: { padding: 15, alignItems: 'center' },
  footerText: { color: COLORS.textLight, fontSize: 12 },
});

export default CustomDrawerContent;