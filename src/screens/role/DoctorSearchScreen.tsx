import React, { useCallback, useMemo, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Pressable,
  TextInput,
  StatusBar,
  Dimensions,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getTheme } from '../../constants/colors';
import { fetchDoctorTypes } from '../../redux/slices/doctorTypeSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_WIDTH = width / 2 - CARD_MARGIN * 2.5;

interface HomeScreenProps {
  navigation: any;
}

const CategoryCard = ({ item, index, theme, onPress }: { item: any; index: number; theme: any; onPress: () => void }) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).springify().damping(16)}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        <Animated.View style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.primary }, animatedStyle]}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.overlayGradient} />
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>Specialist</Text>
            </View>
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={1}>
              {item.title}
            </Text>
            <View style={styles.arrowRow}>
              <Text style={styles.subTitle}>Explore Specialists</Text>
              <Ionicons name="arrow-forward-circle" size={20} color={theme.primary} />
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchDoctorTypes() as any);
  }, [dispatch]);

  const { doctorTypes: allDoctorTypes } = useAppSelector(state => state.doctorTypes);
  const [query, setQuery] = useState('');
  const theme = getTheme('light', 'telemedicine');

  const filteredDoctorTypes = useMemo(() => {
    if (!query.trim()) return allDoctorTypes;
    const q = query.toLowerCase();
    return allDoctorTypes.filter((d: any) => d.title?.toLowerCase().includes(q));
  }, [query, allDoctorTypes]);

  const renderItem = useCallback(
    ({ item, index }: { item: any; index: number }) => (
      <CategoryCard
        item={item}
        index={index}
        theme={theme}
        onPress={() => navigation.navigate('DoctorListScreen', { category: item.title })}
      />
    ),
    [navigation, theme]
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.background} />

      {/* Hero Header */}
      <Animated.View entering={FadeInUp.duration(500)} style={styles.header}>
        <View style={styles.welcomeRow}>
          <View>
            <Text style={styles.welcomeSubTitle}>Hello, Welcome 👋</Text>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Find Your Specialist</Text>
          </View>
          <View style={[styles.avatarCircle, { backgroundColor: theme.primary + '15' }]}>
            <Ionicons name="fitness-outline" size={24} color={theme.primary} />
          </View>
        </View>

        {/* Modern Search Bar */}
        <View style={[styles.searchBar, { backgroundColor: theme.white, borderColor: theme.border }]}>
          <Ionicons name="search-outline" size={20} color={theme.textLight} style={{ marginRight: 8 }} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search specialties, doctors..."
            placeholderTextColor={theme.textLight}
            style={[styles.search, { color: theme.text }]}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color={theme.textLight} />
            </Pressable>
          )}
        </View>
      </Animated.View>

      {/* Grid List */}
      <FlatList
        data={filteredDoctorTypes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        numColumns={2}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },

  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  welcomeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  welcomeSubTitle: { fontSize: 14, color: '#64748B', fontWeight: '500' },
  headerTitle: { fontSize: 24, fontWeight: '800', marginTop: 2, letterSpacing: -0.5 },
  avatarCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    shadowColor: 'rgba(15, 23, 42, 0.04)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 2,
  },
  search: { flex: 1, fontSize: 15, fontWeight: '500' },

  listContent: { paddingHorizontal: 16, paddingBottom: 24, paddingTop: 4 },
  columnWrapper: { justifyContent: 'space-between' },

  card: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
    width: CARD_WIDTH,
    elevation: 3,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  imageContainer: { width: '100%', height: 120, position: 'relative', backgroundColor: '#F1F5F9' },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  overlayGradient: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15, 23, 42, 0.08)' },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: { fontSize: 10, fontWeight: '700', color: '#4F46E5' },

  textContainer: { padding: 12 },
  cardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 6 },
  arrowRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  subTitle: { fontSize: 11, color: '#64748B', fontWeight: '500' },
});
