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
  Pressable,
} from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRoute, useNavigation } from '@react-navigation/native';
import GoBackButton from '../../components/BackButton';

const DoctorListItem = ({ item, index, onPress }: { item: any; index: number; onPress: () => void }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 70).springify().damping(15)}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        <Animated.View style={[styles.card, animatedStyle]}>
          <View style={styles.topRow}>
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: item.profileImage }}
                style={styles.image}
                resizeMode="cover"
              />
              <View style={styles.onlineBadge} />
            </View>

            <View style={styles.info}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{item.fullName}</Text>
                <View style={styles.ratingChip}>
                  <Ionicons name="star" size={12} color="#F59E0B" />
                  <Text style={styles.ratingText}>4.9</Text>
                </View>
              </View>

              <Text style={styles.specialization}>{item.specialization}</Text>
              
              <View style={styles.metaRow}>
                <View style={styles.pillBadge}>
                  <Ionicons name="ribbon-outline" size={12} color="#4F46E5" />
                  <Text style={styles.pillText}>{item.experience} yrs exp</Text>
                </View>

                <View style={[styles.pillBadge, { backgroundColor: '#F0FDFA' }]}>
                  <Ionicons name="time-outline" size={12} color="#06B6D4" />
                  <Text style={[styles.pillText, { color: '#0891B2' }]}>{item.consultationTiming || 'Available'}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color="#64748B" />
              <Text style={styles.addressText} numberOfLines={1}>
                {item.address || 'Medical Center'}
              </Text>
            </View>

            <View style={styles.bookCta}>
              <Text style={styles.bookCtaText}>Book Now</Text>
              <Ionicons name="chevron-forward" size={14} color="#FFFFFF" />
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

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

  const matchedDoctors = category
    ? completedDoctors.filter(
        (doc) => doc.specialization?.toLowerCase() === category?.toLowerCase()
      )
    : completedDoctors;

  const filteredDoctors = matchedDoctors.length > 0 ? matchedDoctors : completedDoctors;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <GoBackButton />
        <Text style={styles.headerTitle}>{category ? `${category} Doctors` : 'Specialists'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <DoctorListItem
            item={item}
            index={index}
            onPress={() => navigation.navigate('AppointmentBooking', { doctor: item })}
          />
        )}
        contentContainerStyle={styles.listPadding}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="medical-outline" size={48} color="#94A3B8" />
            <Text style={styles.empty}>No doctors found for {category}</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  listPadding: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginBottom: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: 'rgba(15, 23, 42, 0.05)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  image: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#F1F5F9',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
  specialization: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4F46E5',
    marginVertical: 2,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4338CA',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    marginRight: 8,
  },
  addressText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  bookCta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 4,
  },
  bookCtaText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  empty: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500',
  },
});
