import React, { useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllDoctors } from "../../redux/actions/doctorActions";
import styles from "../../styles/DoctorScreen.styles";

// TypeScript interfaces
interface ProfileDetails {
  specialized?: string;
  consultationTiming?: string;
}

interface Doctor {
  _id: string;
  fullName: string;
  gender: string;
  dob: string;
  contactNo: string;
  email: string;
  profileDetails?: ProfileDetails;
}

interface DoctorCardProps {
  doctor: Doctor;
  onBook: (doctorId: string) => void;
}

interface RootState {
  doctors: {
    doctors: Doctor[];
    error: string | null;
    loading?: boolean;
  };
}

interface NavigationProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
  };
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBook }) => {
  const { fullName, gender, dob, contactNo, email, profileDetails = {} } = doctor;

  const handleBookPress = useCallback(() => {
    onBook(doctor._id);
  }, [doctor._id, onBook]);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <Text style={styles.name}>{fullName}</Text>
        <Text style={styles.label}>
          Gender: <Text style={styles.value}>{gender}</Text>
        </Text>
        <Text style={styles.label}>
          DOB: <Text style={styles.value}>{dob}</Text>
        </Text>
        <Text style={styles.label}>
          Contact: <Text style={styles.value}>{contactNo}</Text>
        </Text>
        <Text style={styles.label}>
          Email: <Text style={styles.value}>{email}</Text>
        </Text>
        <Text style={styles.label}>
          Specialized: <Text style={styles.value}>{profileDetails.specialized || "N/A"}</Text>
        </Text>
        <Text style={styles.label}>
          Timing: <Text style={styles.value}>{profileDetails.consultationTiming || "N/A"}</Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleBookPress}>
        <Text style={styles.buttonText}>Book Appointment</Text>
      </TouchableOpacity>
    </View>
  );
};

const DoctorScreen: React.FC<NavigationProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { doctors, error, loading = false } = useSelector((state: RootState) => state.doctors);

  // Memoized book handler
  const handleBook = useCallback((doctorId: string) => {
    navigation.navigate("AppointmentBooking", { doctorId });
  }, [navigation]);

  // Memoized render item function
  const renderDoctorItem = useCallback(({ item }: { item: Doctor }) => (
    <DoctorCard doctor={item} onBook={handleBook} />
  ), [handleBook]);

  // Memoized empty component
  const renderEmptyComponent = useMemo(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.empty}>No doctors found. Please try again later.</Text>
    </View>
  ), []);

  // Memoized key extractor
  const keyExtractor = useCallback((item: Doctor) => item._id, []);

  // Fetch doctors on component mount
  useEffect(() => {
    dispatch(fetchAllDoctors() as any);
  }, [dispatch]);

  // Handle error alerts
  useEffect(() => {
    if (error) {
      Alert.alert("Error", error, [
        {
          text: "OK",
          onPress: () => {
            // Optionally retry fetching doctors
            dispatch(fetchAllDoctors() as any);
          },
        },
      ]);
    }
  }, [error, dispatch]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Available Doctors</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A4AFF" />
          <Text style={styles.loadingText}>Loading doctors...</Text>
        </View>
      ) : (
        <FlatList
          data={doctors}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.list}
          renderItem={renderDoctorItem}
          ListEmptyComponent={renderEmptyComponent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={5}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={true}
        />
      )}
    </SafeAreaView>
  );
};

export default DoctorScreen;
