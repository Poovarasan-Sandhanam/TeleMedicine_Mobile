// screens/BookingScreen.tsx

import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { fetchBookings } from '../../redux/actions/bookingActions';
import styles from '../../styles/bookingScreenStyle';
import COLORS from '../../constants/colors';

// Format checkup time range
const formatTimeRange = (range) => {
  const [start, end] = range.split('-').map(Number);
  const format = (hour) => `${hour % 12 || 12}${hour >= 12 ? 'PM' : 'AM'}`;
  return `${format(start)} - ${format(end)}`;
};

const BookingScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { loading, bookings, error } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchBookings());
  }, []);

  useEffect(() => {
    if (error) Alert.alert('Error', error);
  }, [error]);

  const renderBooking = ({ item }) => {
    const showPay = item.status !== 'Success';

    return (
      <View style={styles.cardWrapper}>
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.doctorName}>
              {item.userDetails?.fullName || 'Doctor'}
            </Text>
            <View
              style={[
                styles.statusBadge,
                item.status === 'Success' ? styles.success : styles.pending,
              ]}
            >
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Icon name="phone" size={18} color={COLORS.primary} />
            <Text style={styles.detailText}>
              {item.userDetails?.contactNo || '-'}
            </Text>
          </View>

          <View style={styles.row}>
            <Icon name="calendar" size={18} color={COLORS.primary} />
            <Text style={styles.detailText}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.row}>
            <Icon name="clock-outline" size={18} color={COLORS.primary} />
            <Text style={styles.detailText}>
              {item.checkupTiming ? formatTimeRange(item.checkupTiming) : 'N/A'}
            </Text>
          </View>

          {item.notes ? (
            <View style={styles.notesBox}>
              <Icon name="note-text" size={18} color={COLORS.primary} />
              <Text style={styles.notesText}>{item.notes}</Text>
            </View>
          ) : null}

          {showPay && (
            <TouchableOpacity
              style={styles.payButton}
              onPress={() =>
                navigation.navigate('Payment', { appointmentId: item._id })
              }
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
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.screenTitle}>Your Appointments</Text>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : bookings.length > 0 ? (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id}
          renderItem={renderBooking}
          contentContainerStyle={styles.flatList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No appointments found</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default BookingScreen;
