import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllDoctors } from "../../redux/actions/doctorActions";
import styles from "../../styles/DoctorScreen.styles";

const DoctorCard = ({ doctor, onBook }) => {
  const { fullName, gender, dob, contactNo, email, profileDetails = {} } = doctor;

  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <Text style={styles.name}>{fullName}</Text>
        <Text style={styles.label}>Gender: <Text style={styles.value}>{gender}</Text></Text>
        <Text style={styles.label}>DOB: <Text style={styles.value}>{dob}</Text></Text>
        <Text style={styles.label}>Contact: <Text style={styles.value}>{contactNo}</Text></Text>
        <Text style={styles.label}>Email: <Text style={styles.value}>{email}</Text></Text>
        <Text style={styles.label}>Specialized: <Text style={styles.value}>{profileDetails.specialized || "N/A"}</Text></Text>
        <Text style={styles.label}>Timing: <Text style={styles.value}>{profileDetails.consultationTiming || "N/A"}</Text></Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={onBook}>
        <Text style={styles.buttonText}>Book Appointment</Text>
      </TouchableOpacity>
    </View>
  );
};

const DoctorScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { doctors, error } = useSelector((state) => state.doctors);

  useEffect(() => {
    dispatch(fetchAllDoctors());
  }, [dispatch]);

  useEffect(() => {
    if (error) Alert.alert("Error", error);
  }, [error]);

  const handleBook = (doctorId) => {
    navigation.navigate("AppointmentBooking", { doctorId });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Available Doctors</Text>

      <FlatList
        data={doctors}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <DoctorCard doctor={item} onBook={() => handleBook(item._id)} />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No doctors found. Please try again later.</Text>
        }
      />
    </SafeAreaView>
  );
};

export default DoctorScreen;
