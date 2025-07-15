import React, { useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Image,
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

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor}) => {
  const { fullName, gender, dob, contactNo, email, profileDetails = {} } = doctor;

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
      <View style={styles.section}>
         <Image
    source={{ uri: `https://picsum.photos/200/120?random=${doctor._id}` }}
    style={styles.cardImage}
    resizeMode="cover"
  />

      </View>
    </View>
  );
};

const DoctorScreen: React.FC<NavigationProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { doctors, error, loading = false } = useSelector((state: RootState) => state.doctors);

  // Book handler for individual doctor cards
  const handleBook = useCallback((doctorId: string) => {
    navigation.navigate("AppointmentBooking", { doctorId });
  }, [navigation]);

  // Book handler for global button below the list
  const handleBookPress = useCallback(() => {
    navigation.navigate("AppointmentBooking"); // No doctorId passed
  }, [navigation]);

  const renderDoctorItem = useCallback(({ item }: { item: Doctor }) => (
    <DoctorCard doctor={item} onBook={handleBook} />
  ), [handleBook]);

  const renderEmptyComponent = useMemo(() => (
    <View style={styles.emptyContainer}>
      <Text style={styles.empty}>No doctors found. Please try again later.</Text>
    </View>
  ), []);

  const keyExtractor = useCallback((item: Doctor) => item._id, []);

  useEffect(() => {
    dispatch(fetchAllDoctors() as any);
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error, [
        {
          text: "OK",
          onPress: () => {
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
        <>
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
            removeClippedSubviews
          />

          {/* Button BELOW the doctor list */}
          <TouchableOpacity style={styles.button} onPress={handleBookPress}>
            <Text style={styles.buttonText}>Book Appointment</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};

export default DoctorScreen;
