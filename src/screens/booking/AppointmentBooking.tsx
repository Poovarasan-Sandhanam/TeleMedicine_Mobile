import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
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

const AppointmentBookingScreen = ({ navigation }) => {
  const [healthIssue, setHealthIssue] = useState("");
  const [checkupTiming, setCheckupTiming] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [bookedSlot, setBookedSlot] = useState(null);

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.appointment);
  const { doctors, loading: doctorsLoading } = useSelector((state) => state.doctors);
  const {
    doctorDetails,
    loading: availabilityLoading,
    error: availabilityError,
  } = useSelector((state) => state.doctors);

  useEffect(() => {
    dispatch(fetchAllDoctors());
  }, [dispatch]);

  const handleBooking = async () => {
    if (!healthIssue || !checkupTiming || !doctorId || !formattedDate) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return;
    }

    const appointmentData = {
      healthIssue,
      checkupTiming,
      doctor: doctorId,
      notes,
      date: formattedDate,
    };

    try {
      await dispatch(bookAppointment(appointmentData));
      setBookedSlot(checkupTiming);
      Alert.alert("Success", "Your appointment has been booked.");
      navigation.navigate("MyBooking");
    } catch (err) {
      Alert.alert("Error", err.message || "Failed to book appointment.");
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      setFormattedDate(selectedDate.toISOString().split("T")[0]);
    }
  };

  const convertTo12HourFormat = (time) => {
    const [start, end] = time.split("-");
    const formatTime = (hour) => {
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
  };

  const handleCheckAvailability = () => {
    if (doctorId && formattedDate) {
      dispatch(fetchDoctorDetails(doctorId, formattedDate));
    } else {
      Alert.alert("Select Required Fields", "Doctor and Date must be selected.");
    }
  };

  const handleSlotSelection = (slotTiming) => {
    setCheckupTiming(slotTiming);
  };

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
            <Text style={styles.label}>Select Doctor *</Text>
            {doctorsLoading ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
            ) : doctors.length === 0 ? (
              <View style={styles.emptyState}>
                <Image
                  source={{ uri: "https://cdn-icons-png.flaticon.com/512/3875/3875172.png" }}
                  style={styles.emptyImage}
                />
                <Text style={styles.emptyText}>No doctors available.</Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={() => dispatch(fetchAllDoctors())}
                >
                  <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <OptionDropdown
                data={doctors.map((doc) => ({
                  label: doc.fullName,
                  value: doc._id,
                }))}
                selectedValue={doctorId}
                onValueChange={setDoctorId}
                dropdownStyle={styles.dropdown}
              />
            )}
          </View>

          {/* CHECK AVAILABILITY BUTTON */}
          <TouchableOpacity
            style={styles.checkButton}
            onPress={handleCheckAvailability}
          >
            <Text style={styles.checkButtonText}>Check Availability</Text>
          </TouchableOpacity>

          {/* AVAILABLE SLOTS */}
          {availabilityLoading ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : doctorDetails?.slots ? (
            <View style={styles.slotsContainer}>
              <Text style={styles.label}>Available Slots</Text>
              <View style={styles.slotsWrapper}>
                {doctorDetails.slots.map((slot) => {
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

          {/* SELECTED SLOT */}
          {checkupTiming ? (
            <Text style={styles.selectedSlot}>
              Selected Slot: {convertTo12HourFormat(checkupTiming)}
            </Text>
          ) : null}

          {/* HEALTH ISSUE DROPDOWN */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Health Issue *</Text>
            <CustomDropdown
              data={MedicalConditionsEnum}
              selectedValue={healthIssue}
              onValueChange={setHealthIssue}
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

          {/* SUBMIT BUTTON */}
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

          {/* ERROR DISPLAY */}
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
