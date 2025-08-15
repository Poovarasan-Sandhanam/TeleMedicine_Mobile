import React, { useCallback, useMemo, useState } from 'react';
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

const { width } = Dimensions.get('window');
const CARD_MARGIN = 8;
const CARD_WIDTH = (width / 2) - (CARD_MARGIN * 2);

const DOCTOR_CATEGORIES = [
  { id: 'gp', title: 'General Practitioner (GP)', image: 'https://telemedicine-storage-backend.s3.eu-west-2.amazonaws.com/specialization/special/general.png' },
  { id: 'cardiologist', title: 'Cardiologist', image: 'https://telemedicine-storage-backend.s3.eu-west-2.amazonaws.com/specialization/special/Cardiologist.png' },
  { id: 'pediatrician', title: 'Pediatrician', image: 'https://telemedicine-storage-backend.s3.eu-west-2.amazonaws.com/specialization/special/Pediatrician.jpg' },
  { id: 'orthopedic', title: 'Orthopedic Surgeon', image: "https://telemedicine-storage-backend.s3.eu-west-2.amazonaws.com/specialization/special/Orthopedic.jpg" },
  { id: 'gynecologist', title: 'Gynecologist', image: 'https://telemedicine-storage-backend.s3.eu-west-2.amazonaws.com/specialization/special/Gynecologist.jpg' },
  { id: 'obstetrician', title: 'Obstetrician (OB)', image: 'https://telemedicine-storage-backend.s3.eu-west-2.amazonaws.com/specialization/special/Obstetrician.jpg' },

  { id: 'dermatologist', title: 'Dermatologist', image: 'https://telemedicine-storage-backend.s3.eu-west-2.amazonaws.com/specialization/special/Dermatologist.jpg' },
  { id: 'endocrinologist', title: 'Endocrinologist', image: 'https://telemedicine-storage-backend.s3.eu-west-2.amazonaws.com/specialization/special/Endocrinologist.jpg' },
  { id: 'neurologist', title: 'Neurologist', image: 'https://telemedicine-storage-backend.s3.eu-west-2.amazonaws.com/specialization/special/Neurologist.jpg' },


  { id: 'pediatrician', title: 'Pediatrician', image: 'https://telemedicine-storage-backend.s3.eu-west-2.amazonaws.com/specialization/special/Pediatrician.jpg' },
  { id: 'psychiatrist', title: 'Psychiatrist', image: 'https://telemedicine-storage-backend.s3.eu-west-2.amazonaws.com/specialization/special/Psychiatrist.jpg' },

  { id: 'gastroenterologist', title: 'Gastroenterologist', image: 'https://telemedicine-storage-backend.s3.eu-west-2.amazonaws.com/specialization/special/Gastroenterologist.jpeg' },
  { id: 'pulmonologist', title: 'Pulmonologist', image: 'https://telemedicine-storage-backend.s3.eu-west-2.amazonaws.com/specialization/special/Pulmonologist.jpg' },
  { id: 'oncologist', title: 'Oncologist', image: 'https://telemedicine-storage-backend.s3.eu-west-2.amazonaws.com/specialization/special/Oncologist.jpg' },
  { id: 'ophthalmologist', title: 'Ophthalmologist', image: 'https://telemedicine-storage-backend.s3.eu-west-2.amazonaws.com/specialization/special/Ophthalmologist.jpg' },
  { id: 'urologist', title: 'Urologist', image: 'https://telemedicine-storage-backend.s3.eu-west-2.amazonaws.com/specialization/special/Urologist.jpg' },
];
export default function HomeScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const theme = getTheme('light', 'telemedicine'); // choose theme & scheme

  const data = useMemo(() => {
    if (!query.trim()) return DOCTOR_CATEGORIES;
    const q = query.toLowerCase();
    return DOCTOR_CATEGORIES.filter(
      (d) => d.title.toLowerCase().includes(q)
    );
  }, [query]);

  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.shadow }]}
      activeOpacity={0.85}
      onPress={() => navigation?.navigate?.('Details', { category: item })}
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
  ), [navigation, theme]);

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
        data={data}
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
  cardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4, textAlign: "center" },
});
