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
} from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useDispatch, useSelector } from "react-redux";
import { bookAppointment } from "../../redux/actions/appointmentActions";
import {
  fetchAllDoctors,
  fetchDoctorDetails,
} from "../../redux/actions/doctorActions";
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

interface RootState {
  appointment: {
    loading: boolean;
    error: string | null;
  };
  doctors: {
    doctors: Doctor[];
    loading: boolean;
    doctorDetails: DoctorDetails | null;
    error: string | null;
  };
}

interface NavigationProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
  };
}

const AppointmentBookingScreen: React.FC<NavigationProps> = ({ navigation }) => {
  const [symptomText, setSymptomText] = useState("");
  const [healthIssue, setHealthIssue] = useState<string>("");
  const [checkupTiming, setCheckupTiming] = useState<string>("");
  const [doctorId, setDoctorId] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [bookedSlot, setBookedSlot] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.appointment);
  const { doctors, loading: doctorsLoading } = useSelector((state: RootState) => state.doctors);
  const {
    doctorDetails,
    loading: availabilityLoading,
    error: availabilityError,
  } = useSelector((state: RootState) => state.doctors);

  useEffect(() => {
    dispatch(fetchAllDoctors() as any);
  }, [dispatch]);

  const handleBooking = useCallback(async () => {
    if (!healthIssue || !checkupTiming || !doctorId || !formattedDate) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return;
    }

    const appointmentData: AppointmentData = {
      healthIssue,
      checkupTiming,
      doctor: doctorId,
      notes,
      date: formattedDate,
    };

    try {
      await dispatch(bookAppointment(appointmentData) as any);
      setBookedSlot(checkupTiming);
      Alert.alert("Success", "Your appointment has been booked.");
      navigation.navigate("MyBooking");
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Failed to book appointment.");
    }
  }, [healthIssue, checkupTiming, doctorId, formattedDate, notes, dispatch, navigation]);

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
      dispatch(fetchDoctorDetails(doctorId, formattedDate) as any);
    } else {
      Alert.alert("Select Required Fields", "Doctor and Date must be selected.");
    }
  }, [doctorId, formattedDate, dispatch]);

  const handleSlotSelection = useCallback((slotTiming: string) => {
    setCheckupTiming(slotTiming);
  }, []);

  const handleRetryFetchDoctors = useCallback(() => {
    dispatch(fetchAllDoctors() as any);
  }, [dispatch]);

  const handleAISymptomSuggest = useCallback(async () => {
    if (!symptomText.trim()) {
      Alert.alert("Input Required", "Please enter your symptoms.");
      return;
    }

    try {
      setAiLoading(true);

      // Replace this with your actual AI endpoint
      const response = await fetch("https://your-backend.com/api/ai/suggest-condition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: symptomText }),
      });

      const data = await response.json();

      if (data?.condition) {
        setHealthIssue(data.condition);
      } else {
        Alert.alert("AI Error", "Could not determine health issue.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch suggestion from AI.");
    } finally {
      setAiLoading(false);
    }
  }, [symptomText]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.title}>Book an Appointment</Text>

          {/* DATE PICKER */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Select Date *</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>
                {formattedDate || date.toDateString()}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
          </View>

          {/* DOCTOR DROPDOWN */}
          <View style={styles.formGroup}>
            {doctorsLoading ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : doctors.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No doctors available.</Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={handleRetryFetchDoctors}
                >
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
                onValueChange={setDoctorId}
                label="Select Doctor *"
                dropdownStyle={styles.dropdown}
              />
            )}
          </View>

          {/* CHECK AVAILABILITY */}
          <TouchableOpacity
            style={styles.checkButton}
            onPress={handleCheckAvailability}
          >
            <Text style={styles.checkButtonText}>Check Availability</Text>
          </TouchableOpacity>

          {/* SLOTS */}
          {availabilityLoading ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : doctorDetails?.slots ? (
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
            </View>
          ) : null}

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
            <TouchableOpacity
              style={styles.aiButton}
              onPress={handleAISymptomSuggest}
            >
              {aiLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.aiButtonText}>Suggest Condition</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* HEALTH ISSUE */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Health Issue *</Text>
            <CustomDropdown
              data={MedicalConditionsEnum}
              selectedValue={healthIssue}
              onValueChange={setHealthIssue}
              label="Select Health Issue"
              dropdownStyle={styles.dropdown}
            />
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

          {/* BOOK */}
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : (
            <TouchableOpacity
              style={styles.bookButton}
              onPress={handleBooking}
            >
              <Text style={styles.bookButtonText}>Confirm Booking</Text>
            </TouchableOpacity>
          )}

          {/* ERRORS */}
          {error && <Text style={styles.errorText}>Error: {error}</Text>}
          {availabilityError && (
            <Text style={styles.errorText}>
              Availability Error: {availabilityError}
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AppointmentBookingScreen;
