import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';

const mockDoctorTypes = [
  'General Practitioner',
  'Cardiologist',
  'Pediatrician',
  'Orthopedic Surgeon',
  'Gynecologist',
  'Dermatologist',
  'Neurologist',
  'Psychiatrist',
];

const mockDoctors = [
  { id: '1', name: 'Dr. Smith' },
  { id: '2', name: 'Dr. Johnson' },
  { id: '3', name: 'Dr. Lee' },
];

const mockAvailableSlots = [
  '09:00 AM - 09:30 AM',
  '09:30 AM - 10:00 AM',
  '10:00 AM - 10:30 AM',
  '10:30 AM - 11:00 AM',
  '11:00 AM - 11:30 AM',
];

const AppointmentScreen = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBookAppointment = () => {
    if (!patientName || !selectedSlot) {
      Alert.alert('Error', 'Please enter your name and select a time slot.');
      return;
    }

    Alert.alert(
      'Appointment Booked',
      `Patient: ${patientName}\nDoctor: ${selectedDoctor.name}\nSlot: ${selectedSlot}`,
    );
    setSelectedType(null);
    setSelectedDoctor(null);
    setSelectedSlot(null);
    setPatientName('');
  };

  const renderDoctorTypes = () => (
    <View>
      <Text style={styles.title}>Choose Doctor Type</Text>
      <FlatList
        data={mockDoctorTypes}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.button}
            onPress={() => setSelectedType(item)}>
            <Text style={styles.buttonText}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
      />
    </View>
  );

  const renderDoctors = () => (
    <View>
      <Text style={styles.title}>Choose a Doctor</Text>
      <FlatList
        data={mockDoctors}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.button}
            onPress={() => setSelectedDoctor(item)}>
            <Text style={styles.buttonText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );

  const renderTimeSlots = () => (
    <View>
      <Text style={styles.title}>Choose a Time Slot</Text>
      <FlatList
        data={mockAvailableSlots}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.slotButton}
            onPress={() => setSelectedSlot(item)}>
            <Text style={styles.slotText}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {selectedType === null && renderDoctorTypes()}
          {selectedType !== null && selectedDoctor === null && renderDoctors()}
          {selectedDoctor !== null && renderTimeSlots()}

          {selectedDoctor !== null && (
            <View style={styles.formContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={patientName}
                onChangeText={(text) => setPatientName(text)}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={handleBookAppointment}>
                <Text style={styles.buttonText}>Book Appointment</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  slotButton: {
    backgroundColor: '#28a745',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  slotText: {
    color: '#fff',
    textAlign: 'center',
  },
  formContainer: {
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginVertical: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});

export default AppointmentScreen;
