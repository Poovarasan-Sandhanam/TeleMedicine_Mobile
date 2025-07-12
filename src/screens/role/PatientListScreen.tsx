import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
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
import { fetchAppointments } from "../../redux/actions/appointmentRecordActions";
import moment, { Moment } from "moment";
import styles from "../../styles/appointmentScreen.styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

// TypeScript interfaces
interface UserDetails {
  fullName?: string;
  email?: string;
  contactNo?: string;
  gender?: string;
}

interface Appointment {
  _id: string;
  checkupTiming: string;
  notes?: string;
  status: string;
  date: string;
  userDetails?: UserDetails;
}

interface RootState {
  appointmentRec: {
    loading: boolean;
    appointmentRec: Appointment[];
    error: string;
  };
}

interface DateItemProps {
  item: Moment;
}

const AppointmentScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Moment>(moment().startOf("day"));
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const dispatch = useDispatch();

  const { loading, appointmentRec = [], error } = useSelector(
    (state: RootState) => state.appointmentRec
  );

  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Memoized date generation
  const dates = useMemo(() => {
    const dateArray: Moment[] = [];
    for (let i = -3; i <= 3; i++) {
      dateArray.push(moment().startOf("day").add(i, "days"));
    }
    return dateArray;
  }, []);

  // Memoized time slot formatter
  const formatTimeSlot = useCallback((timeSlot: string): string => {
    const [start, end] = timeSlot.split("-").map(Number);
    const formatTime = (hour: number): string => {
      const period = hour >= 12 ? "PM" : "AM";
      const formattedHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${formattedHour} ${period}`;
    };
    return `${formatTime(start)} - ${formatTime(end)}`;
  }, []);

  // Memoized date press handler
  const handleDatePress = useCallback((date: Moment) => {
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
  }, [scaleAnim]);

  // Memoized appointment press handler
  const handleAppointmentPress = useCallback((item: Appointment) => {
    setSelectedAppointment(item);
    setModalVisible(true);
  }, []);

  // Memoized modal close handler
  const closeModal = useCallback(() => {
    setModalVisible(false);
    setSelectedAppointment(null);
  }, []);

  // Memoized date item renderer
  const renderDateItem = useCallback(({ item }: DateItemProps) => {
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
  }, [selectedDate, scaleAnim, handleDatePress]);

  // Memoized appointment item renderer
  const renderAppointmentItem = useCallback(({ item, index }: { item: Appointment; index: number }) => (
    <TouchableOpacity
      style={[
        styles.appointmentItem,
        index !== appointmentRec.length - 1 && styles.appointmentItemBorder,
      ]}
      onPress={() => handleAppointmentPress(item)}
      activeOpacity={0.7}
    >
      <Text style={styles.appointmentText}>
        Checkup Timing: {formatTimeSlot(item.checkupTiming)}
      </Text>
    </TouchableOpacity>
  ), [appointmentRec.length, handleAppointmentPress, formatTimeSlot]);

  // Memoized empty component
  const renderEmptyComponent = useCallback(() => (
    <View style={styles.noAppointmentsCard}>
      <MaterialIcons
        name="event-busy"
        size={48}
        color={styles.headerText.color}
      />
      <Text style={styles.noAppointmentsTitle}>No Appointments</Text>
      <Text style={styles.noAppointmentsMessage}>
        You don't have any appointments scheduled for this date.
      </Text>
    </View>
  ), []);

  // Memoized modal content
  const renderModalContent = useMemo(() => {
    if (!selectedAppointment) return null;

    return (
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
    );
  }, [selectedAppointment, formatTimeSlot, closeModal]);

  // Fetch appointments when selected date changes
  useEffect(() => {
    const formattedDate = selectedDate.format("DD-MM-YYYY");
    dispatch(fetchAppointments(formattedDate) as any);
  }, [selectedDate, dispatch]);

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

      {loading ? (
        <ActivityIndicator size="large" color="#4A4AFF" style={styles.loader} />
      ) : (
        <FlatList
          data={appointmentRec}
          keyExtractor={(item) => item._id}
          renderItem={renderAppointmentItem}
          ListEmptyComponent={renderEmptyComponent}
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
            {renderModalContent}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AppointmentScreen;
