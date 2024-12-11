import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, Alert } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

const AppointmentBooking = () => {
  const mockDoctors = [
    { id: "123", name: "Dr. Jane Smith", specialization: "Cardiologist", available: true },
    { id: "124", name: "Dr. John Doe", specialization: "Dermatologist", available: true },
  ];

  const [doctors, setDoctors] = useState(mockDoctors);
  const [open, setOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [notes, setNotes] = useState("");

  const bookAppointment = () => {
    if (!selectedDoctor) {
      Alert.alert("Error", "Please select a doctor.");
      return;
    }

    const appointmentData = {
      doctor_id: selectedDoctor,
      patient_id: "456",
      date: appointmentDate.toISOString().split("T")[0],
      time: appointmentDate.toTimeString().split(" ")[0],
      notes,
    };

    Alert.alert("Success", `Appointment booked:\n${JSON.stringify(appointmentData, null, 2)}`);
  };

  return (
    <View style={{ padding: 20 }}>
      {/* Doctor Dropdown */}
      <Text>Select Doctor</Text>
      <DropDownPicker
        open={open}
        value={selectedDoctor}
        items={doctors.map((doc) => ({
          label: `${doc.name} (${doc.specialization})`,
          value: doc.id,
        }))}
        setOpen={setOpen}
        setValue={setSelectedDoctor}
        placeholder="Select a doctor"
        style={{ marginBottom: 20 }}
      />

      {/* Date Picker */}
      <Text>Select Date & Time</Text>
      <DateTimePicker
        value={appointmentDate}
        mode="datetime"
        is24Hour={true}
        display="default"
        onChange={(event, selectedDate) => setAppointmentDate(selectedDate || appointmentDate)}
        style={{ marginVertical: 20 }}
      />

      {/* Notes Input */}
      <Text>Notes</Text>
      <TextInput
        style={{
          height: 100,
          borderColor: "gray",
          borderWidth: 1,
          marginTop: 10,
          paddingHorizontal: 10,
          textAlignVertical: "top",
        }}
        placeholder="Enter notes (optional)"
        multiline={true}
        numberOfLines={4}
        value={notes}
        onChangeText={(text) => setNotes(text)}
      />

      {/* Submit Button */}
      <Button title="Book Appointment" onPress={bookAppointment} />
    </View>
  );
};

export default AppointmentBooking;
