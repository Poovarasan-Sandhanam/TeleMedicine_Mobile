// screens/BookingScreen.tsx

import React, { useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { fetchBookings } from '../../redux/slices/bookingSlice';
import styles from '../../styles/bookingScreenStyle';
import COLORS from '../../constants/colors';
import { RootState } from '../../redux/store';

import Animated, { FadeInDown } from 'react-native-reanimated';

interface UserDetails {
  fullName?: string;
  contactNo?: string;
}

interface Booking {
  _id: string;
  status: string;
  date: string;
  checkupTiming?: string;
  notes?: string;
  userDetails?: UserDetails;
}

// Format checkup time range
const formatTimeRange = (range: string): string => {
  const [start, end] = range.split('-').map(Number);
  const format = (hour: number): string => `${hour % 12 || 12}${hour >= 12 ? 'PM' : 'AM'}`;
  return `${format(start)} - ${format(end)}`;
};

const MyBooking: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { loading, bookings, error } = useAppSelector((state: any) => state.bookings);

  useEffect(() => {
    dispatch(fetchBookings() as any);
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        {
          text: 'OK',
          onPress: () => {
            dispatch(fetchBookings() as any);
          },
        },
      ]);
    }
  }, [error, dispatch]);

  const handlePaymentPress = useCallback((appointmentId: string) => {
    (navigation as any).navigate('Payment', { appointmentId });
  }, [navigation]);

  const renderBooking = useCallback(({ item, index }: { item: Booking; index: number }) => {
    const isSuccess = item.status === 'Success';
    const showPay = !isSuccess;

    return (
      <Animated.View entering={FadeInDown.delay(index * 80).springify().damping(15)}>
        <View style={styles.cardWrapper}>
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={styles.doctorName}>
                {item.userDetails?.fullName || 'Doctor'}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  isSuccess ? styles.success : styles.pending,
                ]}
              >
                <Text style={[styles.statusText, { color: isSuccess ? '#059669' : '#D97706' }]}>
                  {item.status}
                </Text>
              </View>
            </View>

            <View style={styles.row}>
              <Icon name="phone-outline" size={16} color={COLORS.primary} />
              <Text style={styles.detailText}>
                {item.userDetails?.contactNo || '-'}
              </Text>
            </View>

            <View style={styles.row}>
              <Icon name="calendar-month-outline" size={16} color={COLORS.primary} />
              <Text style={styles.detailText}>
                {new Date(item.date).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.row}>
              <Icon name="clock-outline" size={16} color={COLORS.primary} />
              <Text style={styles.detailText}>
                {item.checkupTiming ? formatTimeRange(item.checkupTiming) : 'N/A'}
              </Text>
            </View>

            {item.notes ? (
              <View style={styles.notesBox}>
                <Icon name="note-text-outline" size={16} color={COLORS.primary} />
                <Text style={styles.notesText}>{item.notes}</Text>
              </View>
            ) : null}

            {showPay && (
              <TouchableOpacity
                style={styles.payButton}
                onPress={() => handlePaymentPress(item._id)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[COLORS.primary, COLORS.secondary]}
                  style={styles.payButtonGradient}
                >
                  <Text style={styles.payButtonText}>Pay Now</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Animated.View>
    );
  }, [handlePaymentPress]);

  const keyExtractor = useCallback((item: Booking) => item._id, []);

  const renderEmptyComponent = useMemo(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No appointments found</Text>
    </View>
  ), []);

  const renderLoadingComponent = useMemo(() => (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  ), []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.screenTitle}>Your Appointments</Text>
      {loading ? (
        renderLoadingComponent
      ) : bookings.length > 0 ? (
        <FlatList
          data={bookings}
          keyExtractor={keyExtractor}
          renderItem={renderBooking}
          contentContainerStyle={styles.flatList}
          showsVerticalScrollIndicator={false}
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={true}
        />
      ) : (
        renderEmptyComponent
      )}
    </SafeAreaView>
  );
};

export default MyBooking;
