import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';

interface PatientPaymentProps {
  navigation?: any;
  route?: {
    params?: {
      appointmentId?: string;
    };
  };
}

const PatientPayment: React.FC<PatientPaymentProps> = ({ navigation, route }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const appointmentId = route?.params?.appointmentId;

  const handlePayment = useCallback(async () => {
    if (!appointmentId) {
      Alert.alert('Error', 'Appointment ID is missing');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual payment logic here
      // This is a placeholder for the payment implementation
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      Alert.alert(
        'Success', 
        'Payment completed successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation?.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [appointmentId, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Payment Screen</Text>
        <Text style={styles.description}>
          Press the button below to complete your payment for appointment #{appointmentId}.
        </Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <TouchableOpacity 
            style={styles.payButton} 
            onPress={handlePayment}
            activeOpacity={0.8}
          >
            <Text style={styles.payButtonText}>Pay Now</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default PatientPayment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    elevation: 3,
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
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
    lineHeight: 24,
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
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
