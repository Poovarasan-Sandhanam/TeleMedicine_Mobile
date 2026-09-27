import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchBookings } from '../../redux/slices/bookingSlice';
import { useTheme, space, radius, shortSpecialty } from '../../theme';
import { AppText, Avatar, Card, EmptyState, Reveal, Screen, Segmented, Skeleton, StatusPill } from '../../ui';
import { TAB_BAR_CLEARANCE } from '../../navigation/FloatingTabBar';
import { bookingStart, calendarDay, formatDay, formatSlot } from '../../utilis/format';

type Tab = 'upcoming' | 'past';

const isUpcoming = (b: any) =>
  (b.status === 'confirmed' || b.status === 'held') && bookingStart(b).valueOf() + 3600000 > Date.now();

const DateBlock: React.FC<{ date: string; highlight: boolean }> = ({ date, highlight }) => {
  const { colors } = useTheme();
  const d = calendarDay(date);
  return (
    <View style={[styles.dateBlock, { backgroundColor: colors.surfaceAlt }]}>
      {highlight ? <LinearGradient colors={colors.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} /> : null}
      <AppText variant="caption" rawColor={highlight ? 'rgba(255,255,255,0.85)' : colors.textMuted}>{d.format('MMM')}</AppText>
      <AppText variant="h2" rawColor={highlight ? '#FFFFFF' : colors.text}>{d.format('D')}</AppText>
      <AppText variant="caption" rawColor={highlight ? 'rgba(255,255,255,0.85)' : colors.textMuted}>{d.format('ddd')}</AppText>
    </View>
  );
};

const BookingCard: React.FC<{ item: any; index: number; isDoctor: boolean; upcoming: boolean }> = ({ item, index, isDoctor, upcoming }) => {
  const { colors } = useTheme();
  const who = item.userDetails ?? {};
  const subtitle = isDoctor ? item.healthIssue : shortSpecialty(who.specialization) || item.healthIssue;
  return (
    <Reveal index={index}>
      <Card style={styles.card}>
        <View style={styles.row}>
          <DateBlock date={item.date} highlight={upcoming && index === 0} />
          <View style={styles.body}>
            <View style={styles.nameRow}>
              <Avatar name={who.fullName} uri={who.profileImage} size={28} />
              <AppText variant="bodyStrong" numberOfLines={1} style={styles.name}>{who.fullName || 'Unknown'}</AppText>
            </View>
            {subtitle ? <AppText variant="caption" color="textMuted" numberOfLines={1} style={styles.sub}>{subtitle}</AppText> : null}
            <View style={styles.metaRow}>
              <View style={styles.meta}>
                <Icon name="time-outline" size={14} color={colors.primary} />
                <AppText variant="label" style={styles.metaText}>{formatSlot(item.checkupTiming)}</AppText>
              </View>
              <StatusPill status={item.status} />
            </View>
          </View>
        </View>
        {item.notes ? (
          <View style={[styles.notes, { backgroundColor: colors.surfaceAlt }]}>
            <Icon name="document-text-outline" size={14} color={colors.textMuted} />
            <AppText variant="caption" color="textMuted" style={styles.notesText} numberOfLines={2}>{item.notes}</AppText>
          </View>
        ) : null}
        {isDoctor && who.contactNo ? (
          <View style={styles.contact}>
            <Icon name="call-outline" size={14} color={colors.textMuted} />
            <AppText variant="caption" color="textMuted" style={styles.metaText}>{who.contactNo}</AppText>
          </View>
        ) : null}
      </Card>
    </Reveal>
  );
};

const MyBooking: React.FC = () => {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const { loading, bookings, error } = useAppSelector((s: any) => s.bookings);
  const [tab, setTab] = useState<Tab>('upcoming');
  const [isDoctor, setIsDoctor] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('isDoctor').then(v => setIsDoctor(v ? JSON.parse(v) === true : false)).catch(() => {});
  }, []);

  const load = useCallback(() => {
    dispatch(fetchBookings() as any);
  }, [dispatch]);
  // Reload whenever shown; this tab stays mounted, so loading once missed new bookings.
  useFocusEffect(load);

  const { upcoming, past } = useMemo(() => {
    const up = bookings.filter(isUpcoming).sort((a: any, b: any) => bookingStart(a).valueOf() - bookingStart(b).valueOf());
    const done = bookings.filter((b: any) => !isUpcoming(b)).sort((a: any, b: any) => bookingStart(b).valueOf() - bookingStart(a).valueOf());
    return { upcoming: up, past: done };
  }, [bookings]);
  const data = tab === 'upcoming' ? upcoming : past;

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">Bookings</AppText>
        <AppText variant="body" color="textMuted">
          {upcoming.length ? `${upcoming.length} upcoming · next ${formatDay(upcoming[0].date).toLowerCase()}` : 'Your appointments in one place'}
        </AppText>
        <View style={styles.segment}>
          <Segmented
            value={tab}
            onChange={k => setTab(k as Tab)}
            options={[
              { key: 'upcoming', label: 'Upcoming', count: upcoming.length },
              { key: 'past', label: 'Past', count: past.length },
            ]}
          />
        </View>
      </View>

      {loading && bookings.length === 0 ? (
        <View style={styles.list}>{[0, 1, 2].map(i => <Skeleton key={i} height={120} style={styles.skeleton} />)}</View>
      ) : error && bookings.length === 0 ? (
        <EmptyState icon="cloud-offline-outline" tone="error" title="Couldn't load bookings" message={error} actionLabel="Try again" onAction={load} />
      ) : (
        <FlatList
          key={tab}
          data={data}
          keyExtractor={item => item._id}
          contentContainerStyle={[styles.list, { paddingBottom: TAB_BAR_CLEARANCE }]}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={loading && bookings.length > 0} onRefresh={load} tintColor={colors.primary} />}
          renderItem={({ item, index }) => <BookingCard item={item} index={index} isDoctor={isDoctor} upcoming={tab === 'upcoming'} />}
          ListEmptyComponent={
            tab === 'upcoming' ? (
              <EmptyState
                icon="calendar-clear-outline"
                title="No upcoming visits"
                message={isDoctor ? 'New bookings from patients will appear here.' : 'Find a doctor and book a time that suits you.'}
              />
            ) : (
              <EmptyState icon="time-outline" title="Nothing here yet" message="Completed and cancelled visits will show here." />
            )
          }
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: { paddingHorizontal: space.lg, paddingTop: space.xs },
  segment: { marginTop: space.lg, marginBottom: space.md },
  list: { paddingHorizontal: space.lg, gap: space.sm },
  skeleton: { borderRadius: radius.lg },
  card: {},
  row: { flexDirection: 'row' },
  dateBlock: { width: 62, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', paddingVertical: space.xs, overflow: 'hidden' },
  body: { flex: 1, marginLeft: space.md },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  name: { marginLeft: space.xs, flex: 1 },
  sub: { marginTop: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.sm },
  meta: { flexDirection: 'row', alignItems: 'center' },
  metaText: { marginLeft: 5 },
  notes: { flexDirection: 'row', alignItems: 'flex-start', marginTop: space.sm, padding: space.sm, borderRadius: radius.sm },
  notesText: { marginLeft: 6, flex: 1 },
  contact: { flexDirection: 'row', alignItems: 'center', marginTop: space.sm },
});

export default MyBooking;
