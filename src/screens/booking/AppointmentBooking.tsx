import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
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
import { MedicalConditionsEnum } from "../../utilis/enums";
import OptionDropdown from "../../components/OptionDropdown";

const AppointmentBookingScreen = ({navigation}) => {
  const [healthIssue, setHealthIssue] = useState("");
  const [checkupTiming, setCheckupTiming] = useState(""); // Store selected slot timing
  const [doctorId, setDoctorId] = useState(""); // Store the doctor's ID
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(new Date());
  const [formattedDate, setFormattedDate] = useState(""); // Store formatted date
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [bookedSlot, setBookedSlot] = useState(null);

  const dispatch = useDispatch();


  // Redux states
  const { loading, error } = useSelector((state) => state.appointment);
  const { doctors, loading: doctorsLoading } = useSelector(
    (state) => state.doctors
  );
  const {
    doctorDetails,
    loading: availabilityLoading,
    error: availabilityError,
  } = useSelector((state) => state.doctors);


  // Fetch all doctors on component mount
  useEffect(() => {
    dispatch(fetchAllDoctors());
  }, [dispatch]);
  const handleBooking = async () => {
    if (!healthIssue || !checkupTiming || !doctorId || !formattedDate) {
      Alert.alert("Error", "Please fill all required fields.");
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
      const response = await dispatch(bookAppointment(appointmentData));
      setBookedSlot(checkupTiming); // Update the booked slot
      Alert.alert("Success", "Appointment booked successfully!");
      navigation.navigate("MyBooking"); // Navigate to the MyBooking screen
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to book appointment.");
    }
  };




  const convertTo12HourFormat = (time) => {
    const [start, end] = time.split('-');
    
    const formatTime = (hour) => {
      let period = "AM";
      let newHour = parseInt(hour, 10);
      
      if (newHour >= 12) {
        period = "PM";
        if (newHour > 12) newHour -= 12;  // Convert to 12-hour format
      }
      
      if (newHour === 0) newHour = 12;  // Handle midnight case
      
      return `${newHour} ${period}`;
    };
  
    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false); // Close the picker

    if (selectedDate) {
      setDate(selectedDate);

      // Format the date to YYYY-MM-DD
      const formatted = selectedDate.toISOString().split("T")[0];
      setFormattedDate(formatted); // Save the formatted date in the state
      console.log("Selected Date (Formatted):", formatted); // Outputs: 2025-01-07
    }
  };

  const handleCheckAvailability = () => {
    if (doctorId && formattedDate) {
      dispatch(fetchDoctorDetails(doctorId, formattedDate));
      console.log(doctorId, formattedDate, "-------");
    } else {
      Alert.alert("Error", "Please select a doctor and a date first.");
    }
  };

  const handleSlotSelection = (slotTiming) => {
    setCheckupTiming(slotTiming); // Set the selected timing for booking
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Book an Appointment</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Date</Text>
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

        <View style={styles.formGroup}>
          <Text style={styles.label}>Select Doctor</Text>
          {doctorsLoading ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <View>
              <OptionDropdown
                data={doctors.map((doc) => ({
                  label: doc.fullName,
                  value: doc._id,
                }))}
                selectedValue={doctorId}
                onValueChange={setDoctorId}
                dropdownStyle={{
                  borderColor: COLORS.primary,
                  borderWidth: 1,
                  borderRadius: 5,
                }}
              />
            </View>
          )}
        </View>

       

        <TouchableOpacity style={styles.bookButton}  onPress={handleCheckAvailability}>
          <Text style={styles.bookButtonText}>Check Availability</Text>
        </TouchableOpacity>
  {availabilityLoading ? (
          <ActivityIndicator size="small" color={COLORS.primary} />
        ) : (
          doctorDetails?.slots && (
            <View style={styles.slotsContainer}>
              <Text style={styles.label}>Available Slots</Text>
              <View style={styles.slotsWrapper}>
                {doctorDetails.slots.map((slot) => (
                  <TouchableOpacity
                    key={slot.slotTiming}
                    style={[
                      styles.slotButton,
                      slot.isBooked || bookedSlot === slot.slotTiming
                        ? styles.slotButtonDisabled
                        : null,
                    ]}
                    disabled={slot.isBooked || bookedSlot === slot.slotTiming}
                    onPress={() => handleSlotSelection(slot.slotTiming)}
                  >
                    <Text style={styles.slotText}>
                      {convertTo12HourFormat(slot.slotTiming)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )
        )}

        <Text style={styles.selectedSlot}>
          Selected Slot: {checkupTiming || "None"}
        </Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Health Issue</Text>
          <CustomDropdown
            data={MedicalConditionsEnum}
            selectedValue={healthIssue}
            onValueChange={setHealthIssue}
            dropdownStyle={{
              borderColor: COLORS.primary,
              borderWidth: 1,
              borderRadius: 5,
            }}
          />
        </View>

        <View>
          <Text style={styles.label}>Additional Notes</Text>
          <TextInput
            style={{
              borderColor: COLORS.primary,
              borderWidth: 1,
              borderRadius: 5,
              height: "20%",
              padding: 10,
            }}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any specific details for the doctor"
            multiline
          />
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : (
            <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
              <Text style={styles.bookButtonText}>Book Appointment</Text>
            </TouchableOpacity>
          )}
        </View>

        {error && <Text style={styles.errorText}>Error: {error}</Text>}
        {availabilityError && (
          <Text style={styles.errorText}>
            Availability Error: {availabilityError}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.black,
    marginBottom: 20,
    textAlign: "center",
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
    marginBottom: 5,
  },
  datePickerButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    backgroundColor: COLORS.white,
  },
  dateText: {
    fontSize: 16,
    color: COLORS.primary,
  },
  slotsContainer: {
    marginTop: 20,
  },
  slotsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  slotButton: {
    width: "24%",
    paddingVertical: 10,
    padding: 15,
    marginVertical:5,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    alignItems: "center",
  },
  slotButtonDisabled: {
    backgroundColor: "red",
    borderColor: "grey",
  },
  slotText: {
    fontSize: 13,
    textAlign: "center",
    color: COLORS.black,
  },
  selectedSlot: {
    fontSize: 16,
    marginTop: 15,
    fontWeight: "600",
    textAlign: "center",
    color: COLORS.primary,
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
  bookButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 20,
    width: "80%",
  },
  bookButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default AppointmentBookingScreen;
