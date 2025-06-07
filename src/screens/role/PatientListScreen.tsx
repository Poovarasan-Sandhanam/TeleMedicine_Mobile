import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Modal,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppointments } from "../../redux/actions/: appointmentRecordActions"; // Corrected path
import moment from "moment";

const AppointmentScreen = () => {
  const [selectedDate, setSelectedDate] = useState(moment().startOf("day"));
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const dispatch = useDispatch();

  const {
    loading,
    appointmentRec = [],
    error,
  } = useSelector((state) => state.appointmentRec);

  useEffect(() => {
    const formattedDate = selectedDate.format("DD-MM-YYYY");
    dispatch(fetchAppointments(formattedDate));
  }, [selectedDate]);

  // Helper function to format checkup timing
  const formatTimeSlot = (timeSlot) => {
    const [start, end] = timeSlot.split("-").map(Number);
    const formatTime = (hour) => {
      const period = hour >= 12 ? "PM" : "AM";
      const formattedHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${formattedHour} ${period}`;
    };
    return `${formatTime(start)}-${formatTime(end)}`;
  };

  const generateDates = () => {
    const dates = [];
    for (let i = -3; i <= 3; i++) {
      dates.push(moment().startOf("day").add(i, "days"));
    }
    return dates;
  };

  const dates = generateDates();

  const handleDatePress = (date) => {
    setSelectedDate(date);
  };

  const handleAppointmentPress = (item) => {
    setSelectedAppointment(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedAppointment(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Appointment Records</Text>

      <View>
        <FlatList
          horizontal
          data={dates}
          keyExtractor={(item) => item.format("YYYY-MM-DD")}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.dateItem,
                selectedDate.isSame(item, "day") && styles.selectedDateItem,
              ]}
              onPress={() => handleDatePress(item)}
            >
              <Text style={styles.dateText}>{item.format("DD")}</Text>
              <Text style={styles.dayText}>{item.format("ddd")}</Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <Text style={styles.selectedDateText}>
        Selected Date: {selectedDate.format("DD-MM-YYYY")}
      </Text>

      {/* Appointments List */}
      {loading ? (
        <ActivityIndicator size="large" color="#504DE5" />
      ) : (
        <FlatList
          data={appointmentRec}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.appointmentItem}
              onPress={() => handleAppointmentPress(item)}
            >
              <Text style={styles.appointmentText}>
                Checkup Timing: {formatTimeSlot(item.checkupTiming)}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.noAppointments}>
              No Appointments for this date.
            </Text>
          }
        />
      )}

      {/* Modal for Appointment Details */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedAppointment && (
              <>
                <Text style={styles.modalTitle}>Appointment Details</Text>
                <Text style={styles.modalText}>
                  User Name:{" "}
                  {selectedAppointment.userDetails?.fullName || "N/A"}
                </Text>
                <Text style={styles.modalText}>
                  Checkup Timing:{" "}
                  {formatTimeSlot(selectedAppointment.checkupTiming)}
                </Text>
                <Text style={styles.modalText}>
                  Notes: {selectedAppointment.notes || "None"}
                </Text>
                <Text style={styles.modalText}>
                  Status: {selectedAppointment.status}
                </Text>
                <Text style={styles.modalText}>
                  Date: {moment(selectedAppointment.date).format("DD-MM-YYYY")}
                </Text>
                <Text style={styles.modalText}>
                  Email: {selectedAppointment.userDetails?.email || "N/A"}
                </Text>
                <Text style={styles.modalText}>
                  Contact: {selectedAppointment.userDetails?.contactNo || "N/A"}
                </Text>
                <Text style={styles.modalText}>
                  Gender: {selectedAppointment.userDetails?.gender || "N/A"}
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#504DE5",
    marginBottom: 20,
    textAlign: "center",
  },
  dateItem: {
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginHorizontal: 5,
    height: 70,
    width: 60,
    elevation: 2,
  },
  selectedDateItem: {
    backgroundColor: "#504DE5",
  },
  dateText: {
    fontSize: 16,
    color: "#000",
  },
  dayText: {
    fontSize: 14,
    color: "#555",
  },
  selectedDateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#504DE5",
    marginVertical: 20,
    textAlign: "center",
  },
  appointmentItem: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
  },
  appointmentText: {
    fontSize: 16,
    color: "#333",
  },
  noAppointments: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "90%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#504DE5",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 8,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#504DE5",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AppointmentScreen;
