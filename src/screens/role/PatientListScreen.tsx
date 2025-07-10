import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Animated,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppointments } from "../../redux/actions/: appointmentRecordActions";
import moment from "moment";
import styles from "../../styles/appointmentScreen.styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const AppointmentScreen = () => {
  const [selectedDate, setSelectedDate] = useState(moment().startOf("day"));
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const dispatch = useDispatch();

  const { loading, appointmentRec = [], error } = useSelector(
    (state) => state.appointmentRec
  );

  useEffect(() => {
    const formattedDate = selectedDate.format("DD-MM-YYYY");
    dispatch(fetchAppointments(formattedDate));
  }, [selectedDate]);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const formatTimeSlot = (timeSlot) => {
    const [start, end] = timeSlot.split("-").map(Number);
    const formatTime = (hour) => {
      const period = hour >= 12 ? "PM" : "AM";
      const formattedHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${formattedHour} ${period}`;
    };
    return `${formatTime(start)} - ${formatTime(end)}`;
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
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => setSelectedDate(date));
  };

  const handleAppointmentPress = (item) => {
    setSelectedAppointment(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedAppointment(null);
  };

  const renderDateItem = ({ item }) => {
    const isSelected = selectedDate.isSame(item, "day");
    const isToday = moment().isSame(item, "day");

    return (
      <TouchableOpacity
        onPress={() => handleDatePress(item)}
        activeOpacity={0.8}
        style={{ marginHorizontal: 8 }}
      >
        <Animated.View
          style={[
            styles.dateCircle,
            isSelected && styles.selectedDateCircle,
            isToday && !isSelected && styles.todayDateCircle,
            isSelected && { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Text
            style={[
              styles.dateText,
              isSelected ? styles.selectedDateText : styles.dateTextDefault,
            ]}
          >
            {item.format("DD")}
          </Text>
          <Text
            style={[
              styles.dayText,
              isSelected ? styles.selectedDateText : styles.dayTextDefault,
            ]}
          >
            {item.format("ddd")}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Appointment Records</Text>

      <FlatList
        horizontal
        data={dates}
        keyExtractor={(item) => item.format("YYYY-MM-DD")}
        renderItem={renderDateItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.datesContainer}
        snapToAlignment="center"
        decelerationRate={Platform.OS === "ios" ? 0 : 0.98}
        snapToInterval={80}
      />

      {/* <Text style={styles.selectedDateText}>
        Selected Date: {selectedDate.format("DD-MM-YYYY")}
      </Text> */}

      {loading ? (
        <ActivityIndicator size="large" color="#4A4AFF" style={styles.loader} />
      ) : (
        <FlatList
          data={appointmentRec}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.appointmentItem,
                index !== appointmentRec.length - 1 &&
                  styles.appointmentItemBorder,
              ]}
              onPress={() => handleAppointmentPress(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.appointmentText}>
                Checkup Timing: {formatTimeSlot(item.checkupTiming)}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.noAppointmentsCard}>
              <MaterialIcons
                name="event-busy"
                size={48}
                color={styles.headerText.color}
              />
              <Text style={styles.noAppointmentsTitle}>No Appointments</Text>
              <Text style={styles.noAppointmentsMessage}>
                You don’t have any appointments scheduled for this date.
              </Text>
            </View>
          }
          contentContainerStyle={styles.appointmentList}
        />
      )}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedAppointment && (
              <>
                <Text style={styles.modalTitle}>Appointment Details</Text>
                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>User Name: </Text>
                  {selectedAppointment.userDetails?.fullName || "N/A"}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>Checkup Timing: </Text>
                  {formatTimeSlot(selectedAppointment.checkupTiming)}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>Notes: </Text>
                  {selectedAppointment.notes || "None"}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>Status: </Text>
                  {selectedAppointment.status}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>Date: </Text>
                  {moment(selectedAppointment.date).format("DD-MM-YYYY")}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>Email: </Text>
                  {selectedAppointment.userDetails?.email || "N/A"}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>Contact: </Text>
                  {selectedAppointment.userDetails?.contactNo || "N/A"}
                </Text>
                <Text style={styles.modalText}>
                  <Text style={styles.modalLabel}>Gender: </Text>
                  {selectedAppointment.userDetails?.gender || "N/A"}
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}
                  activeOpacity={0.8}
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

export default AppointmentScreen;
