import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { bookAppointment } from '../../redux/slices/appointmentSlice';
import { fetchAllDoctors, fetchDoctorDetails } from '../../redux/slices/doctorSlice';
import Icon from 'react-native-vector-icons/Ionicons';
import COLORS from '../../constants/colors';
import styles from '../../styles/bookingStyle';
import { useRoute } from '@react-navigation/native';

interface Slot {
  slotTiming: string;
  isBooked: boolean;
}

const AppointmentBookingScreen: React.FC<any> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const route = useRoute<any>();
  const { doctor } = route.params || {};

  const [healthIssue, setHealthIssue] = useState('');
  const [checkupTiming, setCheckupTiming] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const { doctorDetails } = useAppSelector((state) => state.doctors);
  const doctor_Id = doctor?.userId || '';

  useEffect(() => {
    dispatch(fetchAllDoctors() as any);
  }, [dispatch]);

  const validateFields = () => {
    const errors: { [key: string]: string } = {};
    if (!healthIssue) {errors.healthIssue = 'Health issue is required.';}
    if (!checkupTiming) {errors.checkupTiming = 'Slot selection is required.';}
    if (!doctor_Id) {errors.doctor_Id = 'Doctor selection is required.';}
    if (!formattedDate) {errors.date = 'Date is required.';}
    if (date < new Date(new Date().toDateString())) {errors.date = 'Cannot book past dates.';}
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Pure function for rendering button state without updating state
  const isFormValid = () => {
    return (
      healthIssue !== '' &&
      checkupTiming !== '' &&
      doctor_Id !== '' &&
      formattedDate !== '' &&
      date >= new Date(new Date().toDateString())
    );
  };

  const handleReviewBooking = () => {
    if (!validateFields()) {
      Alert.alert('Incomplete Fields', 'Please fill all required fields correctly.');
      return;
    }
    setShowReviewModal(true);
  };

  // Books directly. There used to be a "Payment" step here whose "Pay Now" button
  // booked without charging anything, telling patients they had paid when they had
  // not. Real payment will be added back as its own step.
  const handleConfirmBooking = async () => {
    if (bookingInProgress) {return;}
    setBookingInProgress(true);

    const appointmentData = {
      doctorId: doctor_Id,
      date: formattedDate,
      time: checkupTiming,
      healthIssue,
      notes,
    };

    try {
      await dispatch(bookAppointment(appointmentData) as any).unwrap();
      setShowReviewModal(false);
      Alert.alert('Booked', 'Your appointment is confirmed.');
      navigation.navigate('MyBooking');
    } catch (err: any) {
      // The thunk rejects with the server's message as a string.
      Alert.alert('Could not book', typeof err === 'string' ? err : err?.message || 'Failed to book appointment.');
    } finally {
      setBookingInProgress(false);
    }
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setFormattedDate(selectedDate.toISOString().split('T')[0]);
    }
  };

  const convertTo12HourFormat = (time: string): string => {
    const [start, end] = time.split('-');
    const formatTime = (hour: string) => {
      let h = parseInt(hour, 10);
      const period = h >= 12 ? 'PM' : 'AM';
      if (h > 12) {h -= 12;}
      if (h === 0) {h = 12;}
      return `${h} ${period}`;
    };
    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  const handleCheckAvailability = () => {
    if (!doctor_Id || !formattedDate) {
      Alert.alert('Required Fields', 'Doctor and Date must be selected.');
      return;
    }
    dispatch(fetchDoctorDetails({ id: doctor_Id, selectedDate: formattedDate }) as any);
  };


  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Book an Appointment</Text>

          {/* Date Picker */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, fieldErrors.date && { color: COLORS.primary }]}>Select Date *</Text>
            <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateText}>{formattedDate || date.toDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} minimumDate={new Date()} />
            )}
            {fieldErrors.date && <Text style={styles.errorText}>{fieldErrors.date}</Text>}
          </View>

          <TouchableOpacity style={styles.checkButton} onPress={handleCheckAvailability}>
            <Text style={styles.checkButtonText}>Check Availability</Text>
          </TouchableOpacity>


{doctorDetails?.slots?.length > 0 && (
  <View style={styles.formGroup}>
    <Text style={styles.label}>Select Available Slot *</Text>
    <View style={styles.slotContainer}>
      {doctorDetails.slots.map((slot: Slot, index: number) => {
        const isSelected = checkupTiming === slot.slotTiming;
        return (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            style={[
              styles.slotCard,
              slot.isBooked && styles.slotBookedCard,
              isSelected && styles.slotSelectedCard,
            ]}
            disabled={slot.isBooked}
            onPress={() => setCheckupTiming(slot.slotTiming)}
          >
            <Text
              style={[
                styles.slotText,
                slot.isBooked && { color: '#94A3B8' },
                isSelected && { color: '#FFFFFF', fontWeight: '700' },
              ]}
            >
              {convertTo12HourFormat(slot.slotTiming)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
    {fieldErrors.checkupTiming && <Text style={styles.errorText}>{fieldErrors.checkupTiming}</Text>}
  </View>
)}

          {/* Health Issue */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, fieldErrors.healthIssue && { color: COLORS.primary }]}>Health Issue *</Text>
            <TextInput
              style={styles.input}
              placeholder="Describe your health issue"
              value={healthIssue}
              onChangeText={setHealthIssue}
            />
            {fieldErrors.healthIssue && <Text style={styles.errorText}>{fieldErrors.healthIssue}</Text>}
          </View>

          {/* Notes */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Additional notes"
              multiline
              value={notes}
              onChangeText={setNotes}
            />
          </View>


          {/* Review Button */}
          <TouchableOpacity
            style={[styles.reviewButton, !isFormValid() && { backgroundColor: 'gray' }]}
            onPress={handleReviewBooking}
            disabled={!isFormValid()}
          >
            <Text style={styles.reviewButtonText}>Review Booking</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>



<Modal visible={showReviewModal} transparent animationType="slide">
  <View style={styles.modalBackground}>
    <View style={styles.modalContainer}>
      {/* Close Icon */}
      <TouchableOpacity
        style={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}
        onPress={() => setShowReviewModal(false)}
      >
        <Icon name="close" size={24} color={COLORS.danger} />
      </TouchableOpacity>

      <Text style={styles.modalTitle}>Review Appointment</Text>
      <Text style={styles.modalText}>Doctor: {doctor?.name}</Text>
      <Text style={styles.modalText}>Date: {formattedDate}</Text>
      <Text style={styles.modalText}>Slot: {convertTo12HourFormat(checkupTiming)}</Text>
      <Text style={styles.modalText}>Health Issue: {healthIssue}</Text>
      <Text style={styles.modalText}>Notes: {notes || 'None'}</Text>

      <TouchableOpacity
        style={[styles.modalButton, bookingInProgress && { opacity: 0.6 }]}
        onPress={handleConfirmBooking}
        disabled={bookingInProgress}
      >
        {bookingInProgress ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.modalButtonText}>Confirm Booking</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.modalButton, { backgroundColor: COLORS.primary }]}
        onPress={() => setShowReviewModal(false)}
      >
        <Text style={styles.modalButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
    </SafeAreaView>
  );
};

export default AppointmentBookingScreen;
