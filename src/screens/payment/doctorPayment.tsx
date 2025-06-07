import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const formatTimeRange = (timeRange) => {
  const [start, end] = timeRange.split('-').map(Number);
  const formatTime = (hour) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12; // Convert 0 or 12 to 12 for AM/PM
    return `${formattedHour}${period}`;
  };
  return `${formatTime(start)}-${formatTime(end)}`;
};

const PaymentCheck = () => {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const navigation = useNavigation();

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token is missing. Please log in again.');
      }

      const response = await fetch(
        'http://localhost:3001/api/v1/payment/get-bookings-users',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch booking details.');
      }

      setBookings(result.data.bookingDetails);
    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const renderBookingItem = ({ item }) => {
    const isPaymentSuccess = item.status === 'Success';
    const cardHeight = isPaymentSuccess ? 280 : 240;

    return (
      <View style={[styles.bookingCard]}>
        <LinearGradient
          colors={['#6a11cb', '#2575fc']}
          style={[styles.bookingItemGradient, { height: cardHeight }]}
        >
          <View style={styles.bookingInfo}>
            <Text style={styles.label}>Patient: {item.userDetails?.fullName || 'N/A'}</Text>
            <Text style={styles.label}>Contact No: {item.userDetails?.contactNo || 'N/A'}</Text>
            <Text style={styles.label}>Date: {new Date(item.date).toLocaleDateString()}</Text>
            <Text style={styles.label}>
              Time: {item.checkupTiming ? formatTimeRange(item.checkupTiming) : 'N/A'}
            </Text>
            <Text style={styles.label}>Payment Status: {item.status}</Text>
            <Text style={styles.label}>Notes: {item.notes || 'N/A'}</Text>
          </View>
          {isPaymentSuccess && (
           <TouchableOpacity
           style={styles.prescriptionButtonContainer}
           onPress={() =>
             navigation.navigate('Prescription', {
               doctorId: item.doctor,
               patientId: item.userDetails?._id,
             })
           }
         >
              <LinearGradient
                colors={['#2ecc71', '#27ae60']}
                style={styles.prescriptionButtonGradient}
              >
                <Text style={styles.prescriptionButtonText}>E-Prescription</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </LinearGradient>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Payment Details</Text>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : bookings.length > 0 ? (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id}
          renderItem={renderBookingItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text style={styles.noDataText}>No bookings found.</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    top:10
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 16,
  },
  bookingCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
  },
  bookingItemGradient: {
    padding: 20,
    borderRadius: 10,
  },
  bookingInfo: {},
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  noDataText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  prescriptionButtonContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  prescriptionButtonGradient: {
    width: 160,
    height:30,
    right:20,
    justifyContent: 'center',
    borderRadius:10,
  },
  prescriptionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PaymentCheck;
