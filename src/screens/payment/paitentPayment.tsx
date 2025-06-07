import React, { useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

const PaymentScreen = () => {
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const route = useRoute();

  // Get the appointmentId from route params
  const { appointmentId } = route.params;

  const handlePayment = async () => {
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        throw new Error('User authentication token is missing. Please log in again.');
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch('http://localhost:3001/api/v1/payment/book-now', {
        method: 'POST',
        headers,
        body: JSON.stringify({ appointmentId }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Failed to connect to the server.');
      }

      console.log('API Response:', result);

      const { paymentClientSecret } = result.data;

      const { error } = await stripe.initPaymentSheet({
        paymentIntentClientSecret: paymentClientSecret,
        merchantDisplayName: 'Telemedicine',
      });

      if (error) {
        throw new Error(error.message || 'Failed to initialize payment sheet.');
      }

      const { error: paymentError } = await stripe.presentPaymentSheet();

      if (paymentError) {
        throw new Error(paymentError.message || 'Payment failed. Please try again.');
      }

      Alert.alert('Success', 'Payment completed successfully!');
    } catch (error) {
      console.error('Payment Error:', error);
      Alert.alert('Payment Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Payment Screen</Text>
        <Text style={styles.description}>
          Press the button below to complete your payment.
        </Text>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
            <Text style={styles.payButtonText}>Pay Now</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    width: '90%',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  payButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
  },
  payButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PaymentScreen;
