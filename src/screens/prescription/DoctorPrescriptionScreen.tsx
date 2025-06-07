import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import { addPrescription } from '../../redux/actions/prescriptionActions';

const PrescriptionForm = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const { patientId, doctorId } = route.params || {};
  const { loading, error } = useSelector((state) => state.prescription);

  const [formData, setFormData] = useState({
    patientId: patientId || '',
    doctorId: doctorId || '',
    patientName: '',
    age: '',
    symptoms: '',
    diagnosis: '',
    notes: '',
    date: '',
    medications: [],
  });

  const [medication, setMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
    duration: '',
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      patientId: patientId || '',
      doctorId: doctorId || '',
    }));
  }, [patientId, doctorId]);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleMedicationChange = (name, value) => {
    setMedication({ ...medication, [name]: value });
  };

  const addMedication = () => {
    if (!medication.name || !medication.dosage || !medication.frequency || !medication.duration) {
      Alert.alert('Error', 'Please fill in all medication fields before adding.');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      medications: [...prev.medications, medication],
    }));

    setMedication({ name: '', dosage: '', frequency: '', duration: '' });
  };

  const removeMedication = (index) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (formData.medications.length === 0) {
      Alert.alert('Error', 'Please add at least one medication.');
      return;
    }

    try {
      const formattedData = {
        ...formData,
        symptoms: formData.symptoms.split(',').map((symptom) => symptom.trim()),
        date: new Date(formData.date).toISOString(),
      };

      await dispatch(addPrescription(formattedData));

      if (!error) {
        Alert.alert('Success', 'Prescription added successfully');
        setFormData({
          patientId: patientId || '',
          doctorId: doctorId || '',
          patientName: '',
          age: '',
          symptoms: '',
          diagnosis: '',
          notes: '',
          date: '',
          medications: [],
        });
      }
    } catch (err) {
      console.error('Error During Submission:', err);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Add Prescription</Text>

        <TextInput
          style={styles.input}
          placeholder="Patient Name"
          value={formData.patientName}
          onChangeText={(value) => handleInputChange('patientName', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          value={formData.age}
          onChangeText={(value) => handleInputChange('age', value)}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Symptoms (comma-separated)"
          value={formData.symptoms}
          onChangeText={(value) => handleInputChange('symptoms', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Diagnosis"
          value={formData.diagnosis}
          onChangeText={(value) => handleInputChange('diagnosis', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Notes"
          value={formData.notes}
          onChangeText={(value) => handleInputChange('notes', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Date (YYYY-MM-DD)"
          value={formData.date}
          onChangeText={(value) => handleInputChange('date', value)}
        />

        <Text style={styles.subtitle}>Add Medications</Text>
        <TextInput
          style={styles.input}
          placeholder="Medication Name"
          value={medication.name}
          onChangeText={(value) => handleMedicationChange('name', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Dosage"
          value={medication.dosage}
          onChangeText={(value) => handleMedicationChange('dosage', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Frequency"
          value={medication.frequency}
          onChangeText={(value) => handleMedicationChange('frequency', value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Duration"
          value={medication.duration}
          onChangeText={(value) => handleMedicationChange('duration', value)}
        />
        <TouchableOpacity style={styles.addButton} onPress={addMedication}>
          <Text style={styles.buttonText}>Add Medication</Text>
        </TouchableOpacity>

        <FlatList
          data={formData.medications}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.medicationItem}>
              <Text>{`${item.name}, ${item.dosage}, ${item.frequency}, ${item.duration}`}</Text>
              <TouchableOpacity onPress={() => removeMedication(index)}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />

        <TouchableOpacity
          style={[styles.addButton, styles.submitButton]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Submitting...' : 'Submit'}
          </Text>
        </TouchableOpacity>

        {error && <Text style={styles.error}>Error: {error}</Text>}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    margin:15,
    backgroundColor: '#F2F2F2',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#000',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#504DE5',
  },
  input: {
    borderWidth: 1,
    borderColor: '#504DE5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    backgroundColor: '#F2F2F2',
  },
  addButton: {
    backgroundColor: '#504DE5',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#000',
  },
  buttonText: {
    color: '#F2F2F2',
    fontSize: 16,
    fontWeight: 'bold',
  },
  medicationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#504DE5',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  removeText: {
    color: '#F2F2F2',
    fontWeight: 'bold',
  },
  error: {
    color: '#F2F2F2',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default PrescriptionForm;
