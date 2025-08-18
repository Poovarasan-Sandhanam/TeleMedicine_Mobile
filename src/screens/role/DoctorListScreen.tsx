import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompletedDoctors } from '../../redux/slices/profileSlice';
import { RootState } from '../../redux/store';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function DoctorsScreen() {
  const dispatch = useDispatch<any>();
  const { completedDoctors, loading, error } = useSelector(
    (state: RootState) => state.profile
  );

  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { category } = route.params || {};

  useEffect(() => {
    dispatch(fetchCompletedDoctors());
  }, [dispatch]);

  useEffect(() => {
    console.log('🩺 Category param from navigation:', category);
  }, [category]);

  if (loading) return <Text>Loading doctors...</Text>;
  if (error) return <Text>{error}</Text>;

  // ✅ Filter doctors by specialization
  const filteredDoctors = completedDoctors.filter(
    (doc) =>
      doc.specialization?.toLowerCase() === category?.toLowerCase()
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('AppointmentBooking', { doctor: item })}>
            {/* Doctor Profile Image */}
            <Image
              source={{ uri: item.profileImage }}
              style={styles.image}
              resizeMode="cover"
            />

            {/* Doctor Info */}
            <View style={styles.info}>
              <Text style={styles.name}>{item.fullName}</Text>
              <Text style={styles.specialization}>
                {item.specialization}
              </Text>
              <Text style={styles.experience}>
                {item.experience} years experience
              </Text>
              <Text style={styles.consultation}>
                ⏰ {item.consultationTiming}
              </Text>
              <Text style={styles.address}>📍 {item.address}</Text>

              {/* Certifications */}
              {item.certifications?.length > 0 && (
                <Text style={styles.certifications}>
                  🎓 {item.certifications.join(', ')}
                </Text>
              )}

              {/* Languages */}
              {item.languages?.length > 0 && (
                <Text style={styles.languages}>
                  🌐 Speaks: {item.languages.join(', ')}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No doctors found for {category}</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 10,
  },
  card: {
    backgroundColor: '#a9a4a4ff',
    width: '80%',
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: 'row',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: 12,
    alignContent: 'center',
    alignItems: 'center',
    marginHorizontal: '10%',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  specialization: {
    fontSize: 15,
    color: '#007BFF',
    marginVertical: 2,
  },
  experience: {
    fontSize: 14,
    color: '#555',
  },
  consultation: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  address: {
    fontSize: 13,
    color: '#666',
  },
  certifications: {
    fontSize: 12,
    color: '#444',
    marginTop: 4,
  },
  languages: {
    fontSize: 12,
    color: '#444',
    marginTop: 2,
  },
  empty: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
});
