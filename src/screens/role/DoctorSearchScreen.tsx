import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchDoctorTypes } from '../../redux/slices/doctorTypeSlice';
import { fetchCompletedDoctors } from '../../redux/slices/profileSlice';
import { fetchBookings } from '../../redux/slices/bookingSlice';
import {
  useTheme, space, radius, elevation, specialtyHue, specialtyIcon, shortSpecialty, withAlpha,
} from '../../theme';
import { AppText, Avatar, Card, PressScale, Reveal, Screen, Skeleton, TextField, EmptyState } from '../../ui';
import { TAB_BAR_CLEARANCE } from '../../navigation/FloatingTabBar';
import { bookingStart, formatDay, formatSlot, greeting } from '../../utilis/format';

const COLLAPSED_TILES = 9;

/** Next confirmed appointment that has not started yet. */
const useNextBooking = (bookings: any[]) =>
  useMemo(() => {
    const now = Date.now();
    return bookings
      .filter(b => b.status === 'confirmed' && bookingStart(b).valueOf() + 3600000 > now)
      .sort((a, b) => bookingStart(a).valueOf() - bookingStart(b).valueOf())[0];
  }, [bookings]);

const SpecialtyTile: React.FC<{ item: any; index: number; onPress: () => void }> = ({ item, index, onPress }) => {
  const { colors } = useTheme();
  const name = item.specialization ?? item.title;
  const hue = specialtyHue(name);
  return (
    <Reveal index={index} style={styles.tileWrap}>
      <PressScale
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${item.title} doctors`}
        style={[styles.tile, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <View style={[styles.tileIcon, { backgroundColor: withAlpha(hue, 0.14) }]}>
          <MCI name={specialtyIcon(name)} size={26} color={hue} />
        </View>
        <AppText variant="label" center numberOfLines={2} style={styles.tileLabel}>
          {shortSpecialty(item.title)}
        </AppText>
      </PressScale>
    </Reveal>
  );
};

const DoctorCard: React.FC<{ doctor: any; index: number; onPress: () => void }> = ({ doctor, index, onPress }) => {
  const { colors } = useTheme();
  const hue = specialtyHue(doctor.specialization);
  return (
    <Reveal index={index} from="zoom">
      <Card onPress={onPress} style={styles.doctorCard} accessibilityLabel={`Book ${doctor.fullName ?? doctor.name}`}>
        <Avatar name={doctor.fullName ?? doctor.name} uri={doctor.profileImage} size={56} ring />
        <AppText variant="bodyStrong" numberOfLines={1} style={styles.doctorName}>{doctor.fullName ?? doctor.name}</AppText>
        <View style={styles.inline}>
          <MCI name={specialtyIcon(doctor.specialization)} size={13} color={hue} />
          <AppText variant="caption" rawColor={hue} numberOfLines={1} style={styles.inlineText}>
            {shortSpecialty(doctor.specialization)}
          </AppText>
        </View>
        <View style={[styles.doctorFoot, { borderTopColor: colors.border }]}>
          <AppText variant="caption" color="textMuted">{doctor.experience ?? 0}+ yrs</AppText>
          <View style={[styles.bookPill, { backgroundColor: colors.primarySoft }]}>
            <AppText variant="caption" color="primary">Book</AppText>
          </View>
        </View>
      </Card>
    </Reveal>
  );
};

export default function HomeScreen({ navigation }: { navigation: any }) {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const { doctorTypes, loading: typesLoading } = useAppSelector(s => s.doctorTypes);
  const { completedDoctors } = useAppSelector(s => s.profile);
  const { bookings } = useAppSelector((s: any) => s.bookings);
  const [query, setQuery] = useState('');
  const [firstName, setFirstName] = useState('');
  const [showAll, setShowAll] = useState(false);

  const load = useCallback(() => {
    dispatch(fetchDoctorTypes() as any);
    dispatch(fetchCompletedDoctors() as any);
    dispatch(fetchBookings() as any);
  }, [dispatch]);

  useFocusEffect(load);

  useEffect(() => {
    AsyncStorage.getItem('user')
      .then(u => setFirstName(u ? (JSON.parse(u).fullName ?? '').split(' ')[0] : ''))
      .catch(() => {});
  }, []);

  const next = useNextBooking(bookings);

  const q = query.trim().toLowerCase();
  const tiles = useMemo(() => {
    const list = q ? doctorTypes.filter(t => t.title?.toLowerCase().includes(q)) : doctorTypes;
    return q || showAll ? list : list.slice(0, COLLAPSED_TILES);
  }, [doctorTypes, q, showAll]);
  const doctors = useMemo(
    () => (q
      ? completedDoctors.filter((d: any) =>
          `${d.fullName ?? ''} ${d.name ?? ''} ${d.specialization ?? ''}`.toLowerCase().includes(q))
      : completedDoctors),
    [completedDoctors, q],
  );

  const openDoctor = (doctor: any) => navigation.navigate('AppointmentBooking', { doctor });

  return (
    <Screen
      scroll
      contentStyle={{ paddingBottom: TAB_BAR_CLEARANCE }}
      refreshControl={<RefreshControl refreshing={false} onRefresh={load} tintColor={colors.primary} />}
    >
      <Reveal from="above" style={styles.header}>
        <View style={styles.flex}>
          <AppText variant="label" color="textMuted">{greeting()}</AppText>
          <AppText variant="h1" numberOfLines={1}>{firstName ? `${firstName}` : 'Welcome'}</AppText>
        </View>
        <PressScale onPress={() => navigation.navigate('Profile')} accessibilityRole="button" accessibilityLabel="Your profile">
          <Avatar name={firstName || 'You'} size={48} />
        </PressScale>
      </Reveal>

      <Reveal delay={60}>
        <TextField
          icon="search-outline"
          placeholder="Search specialties or doctors"
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          autoCorrect={false}
          accessibilityLabel="Search specialties or doctors"
        />
      </Reveal>

      {!q ? (
        <Reveal delay={120}>
          <PressScale
            onPress={() => (next ? navigation.navigate('MyBooking') : navigation.navigate('DoctorListScreen', {}))}
            accessibilityRole="button"
            accessibilityLabel={next ? 'Your next appointment' : 'Browse all doctors'}
            style={[styles.promo, elevation(colors.glow, 2)]}
          >
            <LinearGradient colors={colors.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
            <View style={[styles.orb, styles.orbA]} />
            <View style={[styles.orb, styles.orbB]} />
            {next ? (
              <>
                <AppText variant="overline" rawColor="rgba(255,255,255,0.8)">Next appointment</AppText>
                <View style={styles.nextRow}>
                  <Avatar name={next.userDetails?.fullName} size={48} glass />
                  <View style={styles.nextText}>
                    <AppText variant="h3" rawColor="#FFFFFF" numberOfLines={1}>{next.userDetails?.fullName}</AppText>
                    <AppText variant="caption" rawColor="rgba(255,255,255,0.85)" numberOfLines={1}>
                      {shortSpecialty(next.userDetails?.specialization) || next.healthIssue}
                    </AppText>
                  </View>
                </View>
                <View style={styles.glassRow}>
                  <View style={styles.glass}>
                    <Icon name="calendar-outline" size={14} color="#FFFFFF" />
                    <AppText variant="label" rawColor="#FFFFFF" style={styles.glassText}>{formatDay(next.date)}</AppText>
                  </View>
                  <View style={styles.glass}>
                    <Icon name="time-outline" size={14} color="#FFFFFF" />
                    <AppText variant="label" rawColor="#FFFFFF" style={styles.glassText}>{formatSlot(next.checkupTiming)}</AppText>
                  </View>
                </View>
              </>
            ) : (
              <>
                <AppText variant="h2" rawColor="#FFFFFF" style={styles.promoTitle}>Feeling unwell?</AppText>
                <AppText variant="body" rawColor="rgba(255,255,255,0.88)" style={styles.promoText}>
                  Book a trusted specialist in under a minute.
                </AppText>
                <View style={[styles.glass, styles.promoCta]}>
                  <AppText variant="label" rawColor="#FFFFFF">Browse doctors</AppText>
                  <Icon name="arrow-forward" size={15} color="#FFFFFF" style={styles.glassText} />
                </View>
              </>
            )}
          </PressScale>
        </Reveal>
      ) : null}

      <View style={styles.sectionHead}>
        <AppText variant="h3">Specialties</AppText>
        {!q && doctorTypes.length > COLLAPSED_TILES ? (
          <PressScale onPress={() => setShowAll(v => !v)} accessibilityRole="button">
            <AppText variant="label" color="primary">{showAll ? 'Show less' : 'See all'}</AppText>
          </PressScale>
        ) : null}
      </View>

      {typesLoading && doctorTypes.length === 0 ? (
        <View style={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} style={styles.tileWrap}><Skeleton height={122} /></View>
          ))}
        </View>
      ) : tiles.length ? (
        <View style={styles.grid}>
          {tiles.map((t, i) => (
            <SpecialtyTile
              key={t._id ?? t.id}
              item={t}
              index={i}
              onPress={() => navigation.navigate('DoctorListScreen', { category: t.specialization ?? t.title })}
            />
          ))}
        </View>
      ) : (
        <AppText variant="body" color="textMuted" style={styles.none}>No specialty matches "{query}".</AppText>
      )}

      <View style={styles.sectionHead}>
        <AppText variant="h3">{q ? 'Doctors' : 'Top doctors'}</AppText>
        {!q ? (
          <PressScale onPress={() => navigation.navigate('DoctorListScreen', {})} accessibilityRole="button">
            <AppText variant="label" color="primary">View all</AppText>
          </PressScale>
        ) : null}
      </View>

      {doctors.length ? (
        <FlatList
          horizontal
          data={doctors}
          keyExtractor={d => d._id ?? d.userId}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.doctorRow}
          style={styles.bleed}
          renderItem={({ item, index }) => <DoctorCard doctor={item} index={index} onPress={() => openDoctor(item)} />}
        />
      ) : (
        <EmptyState icon="medkit-outline" title={q ? 'No doctors found' : 'No doctors yet'} message={q ? 'Try another name or specialty.' : 'Doctors appear here once their profiles are complete.'} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: space.lg },
  promo: { borderRadius: radius.xl, padding: space.xl, overflow: 'hidden', marginBottom: space.xs },
  orb: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.12)' },
  orbA: { width: 180, height: 180, top: -70, right: -50 },
  orbB: { width: 110, height: 110, bottom: -50, right: 60, backgroundColor: 'rgba(255,255,255,0.08)' },
  promoTitle: { marginBottom: space.xxs },
  promoText: { maxWidth: 240 },
  promoCta: { alignSelf: 'flex-start', marginTop: space.lg },
  nextRow: { flexDirection: 'row', alignItems: 'center', marginTop: space.sm },
  nextText: { flex: 1, marginLeft: space.sm },
  glassRow: { flexDirection: 'row', gap: space.xs, marginTop: space.lg },
  glass: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)',
  },
  glassText: { marginLeft: 6 },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.xl, marginBottom: space.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -5 },
  tileWrap: { width: '33.333%', padding: 5 },
  // Fixed height so a two-line name ("General Practitioner") doesn't make its row uneven.
  tile: { borderRadius: radius.lg, borderWidth: 1, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center', height: 122 },
  tileIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: space.xs },
  tileLabel: { fontSize: 12, lineHeight: 15, height: 30, textAlignVertical: 'center' },
  none: { marginVertical: space.md },
  bleed: { marginHorizontal: -space.lg },
  doctorRow: { paddingHorizontal: space.lg, paddingBottom: space.sm, gap: space.sm },
  doctorCard: { width: 164, alignItems: 'center' },
  doctorName: { marginTop: space.sm, textAlign: 'center' },
  inline: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  inlineText: { marginLeft: 4 },
  doctorFoot: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', alignSelf: 'stretch',
    borderTopWidth: StyleSheet.hairlineWidth, marginTop: space.sm, paddingTop: space.sm,
  },
  bookPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
});
