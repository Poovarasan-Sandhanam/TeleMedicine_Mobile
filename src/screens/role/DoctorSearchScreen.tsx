import React, { useCallback, useMemo, useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import COLORS, { getTheme } from '../../constants/colors';
import { fetchDoctorTypes } from '../../redux/slices/doctorTypeSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_WIDTH = width / 2 - CARD_MARGIN * 2;

export default function HomeScreen({ navigation }) {
  const dispatch = useAppDispatch();

  // Fetch doctor types on mount
  useEffect(() => {
    dispatch(fetchDoctorTypes() as any);
  }, [dispatch]);

  // Redux state
  const { doctorTypes: allDoctorTypes } = useAppSelector(state => state.doctorTypes);

  // Search state
  const [query, setQuery] = useState('');

  const theme = getTheme('light', 'telemedicine'); // choose theme & scheme

  // Filtered doctor types based on search query
  const filteredDoctorTypes = useMemo(() => {
    if (!query.trim()) return allDoctorTypes;
    const q = query.toLowerCase();
    return allDoctorTypes.filter((d) => d.title.toLowerCase().includes(q));
  }, [query, allDoctorTypes]);

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.shadow }]}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('DoctorListScreen', { category: item.title })}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.image} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.cardTitle, { color: theme.text }]} numberOfLines={2}>
            {item.title}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [navigation, theme]
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Find Your Specialist</Text>
        <View style={[styles.searchBar, { backgroundColor: theme.white, borderColor: theme.border }]}>
          <Ionicons name="search" size={20} color={theme.textLight} style={{ marginRight: 8 }} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search doctors..."
            placeholderTextColor={theme.textLight}
            style={[styles.search, { color: theme.text }]}
          />
        </View>
      </View>

      {/* Doctor Categories Grid */}
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

  header: { paddingHorizontal: 16, paddingVertical: 20 },
  headerTitle: { fontSize: 26, fontWeight: '700', marginBottom: 14 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
  },
  search: { flex: 1, fontSize: 16 },

  listContent: { paddingHorizontal: CARD_MARGIN, paddingBottom: 16 },
  columnWrapper: { justifyContent: 'space-between' },

  card: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: CARD_MARGIN * 2,
    width: CARD_WIDTH,
    elevation: 4, // Android shadow
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  imageContainer: { width: '100%', height: 120, backgroundColor: '#ccc' },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },

  textContainer: { padding: 10 },
  cardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4, textAlign: 'center' },
});