import React, { useState, useEffect, useCallback } from "react";
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
} from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  bookAppointment,
} from "../../redux/slices/appointmentSlice";
import {
  fetchAllDoctors,
  fetchDoctorDetails,
} from "../../redux/slices/doctorSlice";
import {
  setSymptoms,
  checkSymptoms,
} from "../../redux/slices/symptomSlice";
import COLORS from "../../utilis/colors";
import CustomDropdown from "../../components/CustomDropdown";
import OptionDropdown from "../../components/OptionDropdown";
import { MedicalConditionsEnum } from "../../utilis/enums";
import styles from "../../styles/bookingStyle";

interface Doctor {
  _id: string;
  fullName: string;
  gender: string;
  dob: string;
  contactNo: string;
  email: string;
  profileDetails?: {
    specialized?: string;
    consultationTiming?: string;
  };
}

interface Slot {
  slotTiming: string;
  isBooked: boolean;
}

interface DoctorDetails {
  slots: Slot[];
}

interface AppointmentData {
  healthIssue: string;
  checkupTiming: string;
  doctor: string;
  notes: string;
  date: string;
}

interface NavigationProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
  };
}

// PaymentModal: simple modal for payment simulation
const PaymentModal = ({ visible, onPay, onCancel, loading }: { visible: boolean; onPay: () => void; onCancel: () => void; loading: boolean }) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onCancel}
  >
    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 24, width: '85%', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Payment</Text>
        <Text style={{ fontSize: 16, marginBottom: 24, textAlign: 'center' }}>Please complete your payment to confirm the booking.</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#2A9D8F" />
        ) : (
          <>
            <TouchableOpacity onPress={onPay} style={{ backgroundColor: '#2A9D8F', padding: 14, borderRadius: 8, width: '80%', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Pay Now</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onCancel} style={{ padding: 12 }}>
              <Text style={{ color: '#E63946', fontWeight: 'bold' }}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  </Modal>
);

const AppointmentBookingScreen: React.FC<NavigationProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  const [symptomText, setSymptomText] = useState("");
  const [healthIssue, setHealthIssue] = useState("");
  const [checkupTiming, setCheckupTiming] = useState("");
  const [doctorId, setDoctorId] = useState<string | number>("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [bookedSlot, setBookedSlot] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [fieldsValid, setFieldsValid] = useState(false);

  const { loading, error } = useAppSelector((state) => state.appointment);
  const { doctors, doctorDetails, error: availabilityError } = useAppSelector((state) => state.doctors);
  const { possibleConditions, recommendedDoctor, status: aiStatus, error: aiError } = useAppSelector((state) => state.symptom);

  useEffect(() => {
    dispatch(fetchAllDoctors() as any);
  }, [dispatch]);

  // Pure function for validation
  const getFieldErrors = () => {
    const errors: {[key: string]: string} = {};
    if (!healthIssue) errors.healthIssue = "Health issue is required.";
    if (!checkupTiming) errors.checkupTiming = "Slot selection is required.";
    if (!doctorId) errors.doctorId = "Doctor selection is required.";
    if (!formattedDate) errors.date = "Date is required.";
    if (date < new Date(new Date().toDateString())) errors.date = "Cannot book in the past.";
    return errors;
  };

  useEffect(() => {
    const errors = getFieldErrors();
    setFieldErrors(errors);
    setFieldsValid(Object.keys(errors).length === 0);
  }, [healthIssue, checkupTiming, doctorId, formattedDate, date]);

  // Review modal logic
  const handleReviewBooking = useCallback(() => {
    if (!fieldsValid) {
      Alert.alert("Missing or Invalid Fields", "Please fill in all required fields correctly.");
      return;
    }
    setShowReviewModal(true);
  }, [fieldsValid]);

  // Payment and booking logic
  const handlePayAndBook = useCallback(async () => {
    if (bookingInProgress) return;
    setBookingInProgress(true);
    // Simulate payment delay
    setTimeout(async () => {
      setShowPaymentModal(false);
      const appointmentData = {
        doctorId: String(doctorId),
        date: formattedDate,
        time: checkupTiming,
        notes,
      };
      try {
        await dispatch(bookAppointment(appointmentData) as any).unwrap();
        setBookedSlot(checkupTiming);
        Alert.alert("Success", "Your appointment has been booked.");
        navigation.navigate("MyBooking");
      } catch (err: any) {
        Alert.alert("Error", err?.message || "Failed to book appointment.");
      } finally {
        setBookingInProgress(false);
      }
    }, 1500); // Simulate payment processing
  }, [doctorId, formattedDate, checkupTiming, notes, dispatch, navigation, bookingInProgress]);

  // After review, show payment modal
  const handleProceedToPayment = useCallback(() => {
    setShowReviewModal(false);
    setShowPaymentModal(true);
  }, []);

  const onDateChange = useCallback((event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setFormattedDate(selectedDate.toISOString().split("T")[0]);
    }
  }, []);

  const convertTo12HourFormat = useCallback((time: string): string => {
    const [start, end] = time.split("-");
    const formatTime = (hour: string): string => {
      let period = "AM";
      let h = parseInt(hour, 10);
      if (h >= 12) {
        period = "PM";
        if (h > 12) h -= 12;
      }
      if (h === 0) h = 12;
      return `${h} ${period}`;
    };
    return `${formatTime(start)} - ${formatTime(end)}`;
  }, []);

  const handleCheckAvailability = useCallback(() => {
    if (doctorId && formattedDate) {
      dispatch(fetchDoctorDetails({ id: String(doctorId), selectedDate: formattedDate }) as any);
    } else {
      Alert.alert("Select Required Fields", "Doctor and Date must be selected.");
    }
  }, [doctorId, formattedDate, dispatch]);

  const handleSlotSelection = useCallback((slotTiming: string) => {
    setCheckupTiming(slotTiming);
    setFieldErrors((prev) => ({ ...prev, checkupTiming: "" }));
  }, []);

  const handleRetryFetchDoctors = useCallback(() => {
    dispatch(fetchAllDoctors() as any);
  }, [dispatch]);

  const handleAISymptomSuggest = async () => {
    if (!symptomText.trim()) {
      Alert.alert("Missing Input", "Please describe your symptoms.");
      return;
    }
    setAiLoading(true);
    try {
      await dispatch(setSymptoms(symptomText));
      await dispatch(checkSymptoms(symptomText) as any);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Book an Appointment</Text>

          {/* DATE PICKER */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, fieldErrors.date && { color: 'red' }]}>Select Date *</Text>
            <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateText}>{formattedDate || date.toDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
                minimumDate={new Date()}
              />
            )}
            {fieldErrors.date && <Text style={styles.errorText}>{fieldErrors.date}</Text>}
          </View>

          {/* SYMPTOM INPUT + AI */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Describe Your Symptoms</Text>
            <TextInput
              style={styles.textArea}
              value={symptomText}
              onChangeText={setSymptomText}
              placeholder="e.g. I have had a sore throat and headache for 2 days"
              multiline
            />
            <TouchableOpacity style={styles.aiButton} onPress={handleAISymptomSuggest} disabled={aiLoading}>
              {aiLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.aiButtonText}>Suggest Condition</Text>
              )}
            </TouchableOpacity>

            {aiStatus === 'succeeded' && possibleConditions.length > 0 && (
              <View style={styles.resultBox}>
                <Text style={styles.label}>AI Suggested Conditions:</Text>
                {possibleConditions.map((condition, index) => (
                  <Text key={index}>• {condition}</Text>
                ))}
                <Text style={styles.label}>Recommended Doctor: {recommendedDoctor}</Text>
              </View>
            )}
          </View>

          {/* DOCTOR DROPDOWN */}
          <View style={styles.formGroup}>
            {doctors.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No doctors available.</Text>
                <TouchableOpacity style={styles.retryButton} onPress={handleRetryFetchDoctors}>
                  <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <OptionDropdown
                data={doctors.map((doc: Doctor) => ({
                  label: doc.fullName,
                  value: doc._id,
                }))}
                selectedValue={doctorId}
                onValueChange={(value) => {
                  setDoctorId(value);
                  setFieldErrors((prev) => ({ ...prev, doctorId: "" }));
                }}
                label="Select Doctor *"
                dropdownStyle={styles.dropdown}
              />
            )}
            {fieldErrors.doctorId && <Text style={styles.errorText}>{fieldErrors.doctorId}</Text>}
          </View>

          {/* CHECK AVAILABILITY */}
          <TouchableOpacity style={styles.checkButton} onPress={handleCheckAvailability}>
            <Text style={styles.checkButtonText}>Check Availability</Text>
          </TouchableOpacity>

          {/* SLOTS */}
          {doctorDetails?.slots && (
            <View style={styles.slotsContainer}>
              <Text style={styles.label}>Available Slots</Text>
              <View style={styles.slotsWrapper}>
                {doctorDetails.slots.map((slot: Slot) => {
                  const isDisabled = slot.isBooked || bookedSlot === slot.slotTiming;
                  return (
                    <TouchableOpacity
                      key={slot.slotTiming}
                      style={[
                        styles.slotButton,
                        isDisabled && styles.slotButtonDisabled,
                        checkupTiming === slot.slotTiming && styles.slotButtonSelected,
                      ]}
                      disabled={isDisabled}
                      onPress={() => handleSlotSelection(slot.slotTiming)}
                    >
                      <Text
                        style={[
                          styles.slotText,
                          isDisabled && { color: "#ccc" },
                          checkupTiming === slot.slotTiming && { color: "#fff" },
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

          {/* HEALTH ISSUE */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, fieldErrors.healthIssue && { color: 'red' }]}>Health Issue *</Text>
            <CustomDropdown
              data={MedicalConditionsEnum}
              selectedValue={healthIssue}
              onValueChange={(value) => {
                setHealthIssue(String(value));
                setFieldErrors((prev) => ({ ...prev, healthIssue: "" }));
              }}
              label="Select Health Issue"
              dropdownStyle={styles.dropdown}
            />
            {fieldErrors.healthIssue && <Text style={styles.errorText}>{fieldErrors.healthIssue}</Text>}
          </View>

          {/* NOTES */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Additional Notes</Text>
            <TextInput
              style={styles.textArea}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any specific concerns or symptoms"
              multiline
            />
          </View>

          {/* BOOK BUTTON */}
          {loading || bookingInProgress ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : (
            <TouchableOpacity
              style={[styles.bookButton, (!fieldsValid || bookingInProgress) && { opacity: 0.5 }]}
              onPress={handleReviewBooking}
              disabled={!fieldsValid || bookingInProgress}
            >
              <Text style={styles.bookButtonText}>Confirm Booking</Text>
            </TouchableOpacity>
          )}

          {/* ERRORS */}
          {error && <Text style={[styles.errorText, { color: '#E63946' }]}>Error: {error}</Text>}
          {availabilityError && <Text style={[styles.errorText, { color: '#E63946' }]}>Availability Error: {availabilityError}</Text>}
          {aiError && <Text style={[styles.errorText, { color: '#E63946' }]}>AI Error: {aiError}</Text>}
        </ScrollView>

        {/* Review Modal */}
        <Modal
          visible={showReviewModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowReviewModal(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 24, width: '85%' }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Review Your Booking</Text>
              <Text>Date: {formattedDate}</Text>
              <Text>Doctor: {doctors.find((d: Doctor) => d._id === doctorId)?.fullName || doctorId}</Text>
              <Text>Slot: {convertTo12HourFormat(checkupTiming)}</Text>
              <Text>Health Issue: {healthIssue}</Text>
              {notes ? <Text>Notes: {notes}</Text> : null}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 }}>
                <TouchableOpacity onPress={() => setShowReviewModal(false)} style={{ padding: 12 }}>
                  <Text style={{ color: '#E63946', fontWeight: 'bold' }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleProceedToPayment} style={{ padding: 12 }}>
                  <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Proceed to Payment</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Payment Modal */}
        <PaymentModal
          visible={showPaymentModal}
          onPay={handlePayAndBook}
          onCancel={() => setShowPaymentModal(false)}
          loading={bookingInProgress}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AppointmentBookingScreen;
