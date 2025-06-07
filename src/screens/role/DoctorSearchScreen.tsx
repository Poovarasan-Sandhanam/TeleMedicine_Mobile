import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { fetchAllDoctors } from "../../redux/actions/doctorActions";
import COLORS from "../../utilis/colors";

const DoctorScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { doctors, error } = useSelector((state) => state.doctors);

const enrichedDoctors = doctors.map((doctor) => ({
  ...doctor,
  profileDetails: doctor?.profileDetails || {}, // Ensure profileDetails is always defined
}));

useEffect(() => {
  dispatch(fetchAllDoctors());
}, [dispatch]);

const renderDoctorItem = ({ item }) => (
  <View style={styles.doctorCard}>
    <Text style={styles.doctorName}>{item.fullName}</Text>
    <Text style={styles.detailText}>Gender: {item.gender}</Text>
    <Text style={styles.detailText}>DOB: {item.dob}</Text>
    <Text style={styles.detailText}>Contact: {item.contactNo}</Text>
    <Text style={styles.detailText}>Email: {item.email}</Text>
    <Text style={styles.detailText}>Specialized: {item.profileDetails?.specialized || "N/A"}</Text>
    <Text style={styles.detailText}>
      Consultation Timing: {item.profileDetails?.consultationTiming || "N/A"}
    </Text>
  </View>
);

return (
  <SafeAreaView style={styles.container}>
    <Text style={styles.title}>Available Doctors</Text>
    {error && <Text style={styles.error}>Error: {error}</Text>}
    <FlatList
      data={enrichedDoctors}
      keyExtractor={(item) => item._id} // Use _id as the key
      renderItem={renderDoctorItem}
      contentContainerStyle={styles.listContent}
    />
    <TouchableOpacity
      style={styles.bookButton}
      onPress={() =>
        navigation.navigate("AppointmentBooking", { doctorId: enrichedDoctors[0]._id })
      }
    >
      <Text style={styles.bookButtonText}>Book Appointment</Text>
    </TouchableOpacity>
  </SafeAreaView>
);
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 20,
  },
  error: {
    color: COLORS.error,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  doctorCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2, // For Android shadow
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  listContent: {
    paddingBottom: 20, // Space below the list
  },
  bookButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 20,
    width: "80%",
    bottom:30
  },
  bookButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default DoctorScreen;
