// screens/BookingScreen.tsx

import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { fetchBookings } from '../../redux/slices/bookingSlice';
import styles from '../../styles/bookingScreenStyle';
import COLORS from '../../constants/colors';

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

/** Label and colours for each appointment status the server can return. */
const STATUS_STYLE: Record<string, { label: string; text: string; bg: string }> = {
  confirmed: { label: 'Confirmed', text: '#059669', bg: '#D1FAE5' },
  completed: { label: 'Completed', text: '#2563EB', bg: '#DBEAFE' },
  cancelled: { label: 'Cancelled', text: '#DC2626', bg: '#FEE2E2' },
  held: { label: 'Awaiting payment', text: '#D97706', bg: '#FEF3C7' },
};
const statusStyle = (status: string) =>
  STATUS_STYLE[status] ?? { label: status || 'Unknown', text: '#6B7280', bg: '#F3F4F6' };

const MyBooking: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, bookings, error } = useAppSelector((state: any) => state.bookings);

  const load = useCallback(() => {
    dispatch(fetchBookings() as any);
  }, [dispatch]);

  // Reload each time the screen is shown. Loading only on mount meant a booking made
  // moments ago did not appear, because this tab stays mounted.
  useFocusEffect(load);

  const renderBooking = useCallback(({ item, index }: { item: Booking; index: number }) => {
    const badge = statusStyle(item.status);

    return (
      <Animated.View entering={FadeInDown.delay(index * 80).springify().damping(15)}>
        <View style={styles.cardWrapper}>
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={styles.doctorName}>
                {item.userDetails?.fullName || 'Unknown'}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                <Text style={[styles.statusText, { color: badge.text }]}>
                  {badge.label}
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

          </View>
        </View>
      </Animated.View>
    );
  }, []);

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
      {loading && bookings.length === 0 ? (
        renderLoadingComponent
      ) : error && bookings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{error}</Text>
          <TouchableOpacity onPress={load} activeOpacity={0.8}>
            <Text style={[styles.emptyText, { color: COLORS.primary, marginTop: 12 }]}>Try again</Text>
          </TouchableOpacity>
        </View>
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
          refreshing={loading}
          onRefresh={load}
        />
      ) : (
        renderEmptyComponent
      )}
    </SafeAreaView>
  );
};

export default MyBooking;
