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
  // Destructure navigation prop
  const dispatch = useDispatch();
  const { doctors, error } = useSelector((state) => state.doctors); // Correct reducer key: "doctors"
  const values = doctors.map(doctor => doctor.id);
  console.log(values[0]);
  
  useEffect(() => {
    dispatch(fetchAllDoctors());
  }, [dispatch]);

  const renderDoctorItem = ({ item }) => (
    <TouchableOpacity style={styles.doctorCard}>
      <Text style={styles.doctorName}>{item.fullName}</Text>
      <Text>{item.gender}</Text>
      <Text>{item.dob}</Text>
      <Text>{item.contactNo}</Text>
      <Text>{item.email}</Text>
      <Text>{item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Doctors</Text>
      <View style={styles.contentBox}>
        <FlatList
          data={doctors}
          keyExtractor={(item) => item.id}
          renderItem={renderDoctorItem}
          //contentContainerStyle={styles.listContent}
        />
        <TouchableOpacity
          style={styles.Book}
          onPress={() => navigation.navigate("AppointmentBooking", { doctorId: values[0]})}
        >
          <Text style={styles.BookText}>Book</Text>
          <Text style={styles.BookText}>Appointment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 16,
    textAlign: "center",
  },
  doctorCard: {
    padding: 16,
    borderRadius: 8,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "600",
  },
  error: {
    color: "red",
    marginBottom: 16,
    textAlign: "center",
  },
  Book: {
    backgroundColor: COLORS.primary,
    height: "40%",
    width: "35%",
    marginHorizontal: 10,
    marginVertical: 40,
    borderRadius: 10,
  },
  BookText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
  contentBox: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    width: "95%",
    alignSelf: "center",
    borderRadius:10
  },
});

export default DoctorScreen;
