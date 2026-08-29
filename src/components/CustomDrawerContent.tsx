import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItem, DrawerContentComponentProps } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppDispatch } from '../redux/hooks';
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../constants/colors';
import { RootState } from '../redux/store';
import { fetchProfile, initializeLocalProfile } from '../redux/slices/profileSlice';

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const dispatch = useAppDispatch();

  const profile = useSelector((state: RootState) => state.profile.profile);
  const isDoctor = profile?.isDoctor || false;

  // Load profile on mount
  useEffect(() => {
    dispatch(initializeLocalProfile() as any); // load local AsyncStorage profile first
    dispatch(fetchProfile() as any); // fetch fresh profile from API
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
        <View style={styles.avatarWrapper}>
          <Image
            source={
              user.avatar
                ? { uri: user.avatar }
                : require('../asset/profile.png')
            }
            style={styles.avatar}
          />
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{isDoctor ? 'Doctor' : 'Patient'}</Text>
          </View>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* Navigation Items */}
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
        <DrawerItem
          label="Home"
          labelStyle={styles.drawerLabel}
          icon={({ size }) => <Icon name="grid-view" color="#4F46E5" size={size} />}
          onPress={() => handleNavigation('Tabs')}
          activeTintColor="#4F46E5"
          inactiveTintColor="#0F172A"
          style={styles.drawerItem}
        />
        <DrawerItem
          label="Profile"
          labelStyle={styles.drawerLabel}
          icon={({ size }) => <Icon name="person-outline" color="#4F46E5" size={size} />}
          onPress={() => handleNavigation('Profile')}
          activeTintColor="#4F46E5"
          inactiveTintColor="#0F172A"
          style={styles.drawerItem}
        />
        {!isDoctor && (
          <DrawerItem
            label="My Booking"
            labelStyle={styles.drawerLabel}
            icon={({ size }) => <Icon name="calendar-today" color="#4F46E5" size={size} />}
            onPress={() => handleNavigation('MyBooking')}
            activeTintColor="#4F46E5"
            inactiveTintColor="#0F172A"
            style={styles.drawerItem}
          />
        )}
        <DrawerItem
          label="Consult"
          labelStyle={styles.drawerLabel}
          icon={({ size }) => <MaterialCommunityIcons name="video-outline" color="#4F46E5" size={size} />}
          onPress={() => handleNavigation('Consult')}
          activeTintColor="#4F46E5"
          inactiveTintColor="#0F172A"
          style={styles.drawerItem}
        />
      </DrawerContentScrollView>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
        <Icon name="logout" size={20} color="#EF4444" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>TeleMedicine v1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  drawerContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: { width: 72, height: 72, borderRadius: 36, borderWidth: 3, borderColor: 'rgba(255, 255, 255, 0.8)' },
  roleBadge: {
    position: 'absolute',
    bottom: -4,
    backgroundColor: '#06B6D4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'center',
  },
  roleBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700' },
  name: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  email: { color: 'rgba(255, 255, 255, 0.8)', fontSize: 12, marginTop: 2 },
  drawerContent: { paddingTop: 16 },
  drawerItem: { marginVertical: 2, marginHorizontal: 12, borderRadius: 12 },
  drawerLabel: { color: '#0F172A', fontWeight: '600', fontSize: 15 },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginHorizontal: 20, marginVertical: 10 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 24 },
  logoutText: { color: '#EF4444', fontWeight: '700', fontSize: 15, marginLeft: 12 },
  footer: { padding: 16, alignItems: 'center' },
  footerText: { color: '#94A3B8', fontSize: 12, fontWeight: '500' },
});

export default CustomDrawerContent;
