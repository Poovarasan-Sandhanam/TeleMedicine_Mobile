import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Alert,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { fetchBookings } from '../../redux/actions/bookingActions';

// Helper function to format time
const formatTimeRange = (timeRange) => {
  const [start, end] = timeRange.split('-').map(Number);

  const formatTime = (hour) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12; // Convert 0 or 12 to 12 for AM/PM
    return `${formattedHour}${period}`;
  };

  return `${formatTime(start)}-${formatTime(end)}`;
};

const BookingScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { loading, bookings, error } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const renderBookingItem = ({ item }) => {
    const showPayButton = item.status !== 'Success'; // Check if "Pay" button should be displayed
    const dynamicHeight = showPayButton ? 279 : 240; // Adjust height based on button visibility

    return (
      <View style={styles.bookingCard}>
        <LinearGradient
          colors={['#6a11cb', '#2575fc']} // Gradient colors
          style={[styles.bookingItemGradient, { height: dynamicHeight }]}
        >
          <View style={styles.bookingInfo}>
            <Text style={styles.bookingText}>
              Doctor: {item.userDetails?.fullName || 'N/A'}
            </Text>
            <Text style={styles.bookingText}>
              Contact No: {item.userDetails?.contactNo || 'N/A'}
            </Text>
            <Text style={styles.bookingText}>
              Date: {new Date(item.date).toLocaleDateString()}
            </Text>
            <Text style={styles.bookingText}>
              Time: {item.checkupTiming ? formatTimeRange(item.checkupTiming) : 'N/A'}
            </Text>
            <Text style={styles.bookingText}>
              Status: {item.status || 'N/A'}
            </Text>
            <Text style={styles.bookingText} numberOfLines={2} ellipsizeMode="tail">
              Notes: {item.notes || 'N/A'}
            </Text>
          </View>
          {showPayButton && (
            <TouchableOpacity
              style={styles.payButtonContainer}
              onPress={() => navigation.navigate('Payment', { appointmentId: item._id })}
            >
              <LinearGradient
                colors={['#000000', '#434343']} // Black-based gradient colors
                style={styles.payButtonGradient}
              >
                <Text style={styles.payButtonText}>Pay</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </LinearGradient>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Bookings</Text>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : bookings.length > 0 ? (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id}
          renderItem={renderBookingItem}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.noBookingsText}>No bookings found.</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
  },
  bookingCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden', // Prevent gradient overflow
  },
  bookingItemGradient: {
    padding: 20,
    borderRadius: 10,
  },
  bookingInfo: {},
  bookingText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  noBookingsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContent: {
    paddingBottom: 16,
  },
  payButtonContainer: {
   left:75,
    top:15,
  },
  payButtonGradient: {
    width: 120,
    height: 50,
    justifyContent: 'center',
    borderRadius: 25,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default BookingScreen;
