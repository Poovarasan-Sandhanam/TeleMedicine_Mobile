import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Modal, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { SlideInDown } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import moment, { Moment } from 'moment';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchAppointments } from '../../redux/slices/appointmentRecordSlice';
import { useTheme, space, radius, elevation } from '../../theme';
import { AppText, Avatar, Button, Card, EmptyState, PressScale, Reveal, Screen, Skeleton, StatusPill } from '../../ui';
import { TAB_BAR_CLEARANCE } from '../../navigation/FloatingTabBar';
import { formatSlot, greeting } from '../../utilis/format';

const PAST_DAYS = 3;
const FUTURE_DAYS = 13;

const Stat: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <View style={styles.stat}>
    <AppText variant="h1" rawColor="#FFFFFF">{value}</AppText>
    <AppText variant="caption" rawColor="rgba(255,255,255,0.82)">{label}</AppText>
  </View>
);

const DetailRow: React.FC<{ icon: string; label: string; value?: string }> = ({ icon, label, value }) => {
  const { colors } = useTheme();
  if (!value) {
    return null;
  }
  return (
    <View style={styles.detailRow}>
      <View style={[styles.detailIcon, { backgroundColor: colors.primarySoft }]}>
        <Icon name={icon} size={16} color={colors.primary} />
      </View>
      <View style={styles.flex}>
        <AppText variant="caption" color="textMuted">{label}</AppText>
        <AppText variant="bodyStrong">{value}</AppText>
      </View>
    </View>
  );
};

const ScheduleScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { loading, appointmentRec = [], error } = useAppSelector((s: any) => s.appointmentRec);

  const days = useMemo(
    () => Array.from({ length: PAST_DAYS + FUTURE_DAYS + 1 }, (_, i) => moment().startOf('day').add(i - PAST_DAYS, 'days')),
    [],
  );
  const [day, setDay] = useState<Moment>(days[PAST_DAYS]);
  const [selected, setSelected] = useState<any | null>(null);
  const [name, setName] = useState('');
  const strip = useRef<FlatList<Moment>>(null);

  useEffect(() => {
    AsyncStorage.getItem('user').then(u => setName(u ? (JSON.parse(u).fullName ?? '') : '')).catch(() => {});
  }, []);

  const load = useCallback(() => {
    dispatch(fetchAppointments(day.format('DD-MM-YYYY')) as any);
  }, [dispatch, day]);
  // Reload on date change and on focus, so new bookings and just-completed
  // appointments (after writing a prescription) show up.
  useFocusEffect(load);

  const stats = useMemo(() => ({
    total: appointmentRec.length,
    done: appointmentRec.filter((a: any) => a.status === 'completed').length,
    open: appointmentRec.filter((a: any) => a.status === 'confirmed').length,
  }), [appointmentRec]);

  const canPrescribe = selected && (selected.status === 'confirmed' || selected.status === 'completed');

  const writePrescription = () => {
    const appt = selected;
    setSelected(null);
    navigation.navigate('WritePrescription', { appointmentId: appt._id, patientName: appt.userDetails?.fullName ?? '' });
  };

  return (
    <Screen tint={false} edges={[]}>
      <FlatList
        data={loading && appointmentRec.length === 0 ? [] : appointmentRec}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: TAB_BAR_CLEARANCE }}
        refreshControl={<RefreshControl refreshing={false} onRefresh={load} tintColor={colors.primary} />}
        ListHeaderComponent={
          <>
            {/* Gradient as an absolute background: LinearGradient paints inside its own
                padding under the new-architecture interop, which inset the header. */}
            <View style={[styles.hero, { paddingTop: insets.top + space.md }]}>
              <LinearGradient colors={colors.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
              <View style={[styles.orb, styles.orbA]} />
              <Reveal from="above">
                <AppText variant="label" rawColor="rgba(255,255,255,0.82)">{greeting()}</AppText>
                <AppText variant="h1" rawColor="#FFFFFF" numberOfLines={1}>{name || 'Your schedule'}</AppText>
              </Reveal>
              <View style={styles.stats}>
                <Stat value={stats.total} label={day.isSame(moment(), 'day') ? 'Today' : day.format('ddd D MMM')} />
                <View style={styles.statDivider} />
                <Stat value={stats.open} label="To see" />
                <View style={styles.statDivider} />
                <Stat value={stats.done} label="Completed" />
              </View>
            </View>

            <FlatList
              ref={strip}
              horizontal
              data={days}
              keyExtractor={d => d.format('YYYY-MM-DD')}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.days}
              // Start on today with the usual left margin (58pt chip + 8pt gap per day).
              contentOffset={{ x: PAST_DAYS * 66, y: 0 }}
              renderItem={({ item }) => {
                const active = item.isSame(day, 'day');
                const today = item.isSame(moment(), 'day');
                return (
                  <PressScale
                    onPress={() => setDay(item)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    accessibilityLabel={item.format('dddd D MMMM')}
                    style={[styles.day, { backgroundColor: colors.surface, borderColor: active ? 'transparent' : colors.border }]}
                  >
                    {active ? <LinearGradient colors={colors.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} /> : null}
                    <AppText variant="caption" rawColor={active ? 'rgba(255,255,255,0.85)' : colors.textMuted}>{today ? 'Today' : item.format('ddd')}</AppText>
                    <AppText variant="h3" rawColor={active ? '#FFFFFF' : colors.text}>{item.format('D')}</AppText>
                  </PressScale>
                );
              }}
            />
            <AppText variant="h3" style={styles.sectionTitle}>
              {day.isSame(moment(), 'day') ? "Today's appointments" : `Appointments · ${day.format('ddd D MMM')}`}
            </AppText>
            {loading && appointmentRec.length === 0 ? (
              <View style={styles.pad}>{[0, 1].map(i => <Skeleton key={i} height={92} style={styles.skeleton} />)}</View>
            ) : null}
          </>
        }
        renderItem={({ item, index }) => (
          <Reveal index={index} style={styles.timelineItem}>
            <View style={styles.timeCol}>
              <AppText variant="label">{formatSlot(item.checkupTiming).split(' - ')[0]}</AppText>
              <View style={[styles.dot, { backgroundColor: item.status === 'completed' ? colors.info : colors.primary }]} />
              {index < appointmentRec.length - 1 ? <View style={[styles.line, { backgroundColor: colors.border }]} /> : null}
            </View>
            <Card onPress={() => setSelected(item)} style={styles.apptCard} accessibilityLabel={`${item.userDetails?.fullName}, ${formatSlot(item.checkupTiming)}`}>
              <View style={styles.row}>
                <Avatar name={item.userDetails?.fullName} uri={item.userDetails?.profileImage} size={42} />
                <View style={styles.apptText}>
                  <AppText variant="bodyStrong" numberOfLines={1}>{item.userDetails?.fullName ?? 'Patient'}</AppText>
                  <AppText variant="caption" color="textMuted" numberOfLines={1}>{item.healthIssue || 'General consultation'}</AppText>
                </View>
                <Icon name="chevron-forward" size={18} color={colors.textSubtle} />
              </View>
              <View style={styles.apptFoot}>
                <AppText variant="caption" color="textMuted">{formatSlot(item.checkupTiming)}</AppText>
                <StatusPill status={item.status} />
              </View>
            </Card>
          </Reveal>
        )}
        ListEmptyComponent={
          loading ? null : error ? (
            <EmptyState icon="cloud-offline-outline" tone="error" title="Couldn't load appointments" message={error} actionLabel="Try again" onAction={load} />
          ) : (
            <EmptyState icon="cafe-outline" title="A clear day" message="No appointments booked for this date." />
          )
        }
      />

      <Modal visible={!!selected} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: colors.overlay }]} onPress={() => setSelected(null)} accessibilityLabel="Close" />
        {selected ? (
          <Animated.View
            entering={SlideInDown.springify().damping(18).stiffness(180)}
            style={[styles.sheet, { backgroundColor: colors.surface, paddingBottom: Math.max(insets.bottom, space.lg) }, elevation(colors.shadow, 3)]}
          >
            <View style={[styles.grabber, { backgroundColor: colors.border }]} />
            <View style={styles.row}>
              <Avatar name={selected.userDetails?.fullName} uri={selected.userDetails?.profileImage} size={56} ring />
              <View style={styles.apptText}>
                <AppText variant="h2" numberOfLines={1}>{selected.userDetails?.fullName ?? 'Patient'}</AppText>
                <StatusPill status={selected.status} />
              </View>
            </View>
            <View style={styles.details}>
              <DetailRow icon="time-outline" label="When" value={`${moment(selected.date).utc().format('ddd D MMM')} · ${formatSlot(selected.checkupTiming)}`} />
              <DetailRow icon="medkit-outline" label="Reason" value={selected.healthIssue} />
              <DetailRow icon="document-text-outline" label="Notes" value={selected.notes} />
              <DetailRow icon="call-outline" label="Phone" value={selected.userDetails?.contactNo} />
              <DetailRow icon="mail-outline" label="Email" value={selected.userDetails?.email} />
              <DetailRow icon="person-outline" label="Gender" value={selected.userDetails?.gender} />
            </View>
            {canPrescribe ? (
              <Button title="Write Prescription" icon="create-outline" onPress={writePrescription} />
            ) : null}
            <Button title="Close" variant="ghost" size="md" onPress={() => setSelected(null)} style={styles.close} />
          </Animated.View>
        ) : null}
      </Modal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  hero: { paddingHorizontal: space.lg, paddingBottom: space.xl, borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl, overflow: 'hidden' },
  orb: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.12)' },
  orbA: { width: 220, height: 220, top: -90, right: -70 },
  stats: {
    flexDirection: 'row', alignItems: 'center', marginTop: space.lg, paddingVertical: space.md, borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.16)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)',
  },
  stat: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.25)' },
  days: { paddingHorizontal: space.lg, paddingVertical: space.lg, gap: 8 },
  day: { width: 58, height: 72, borderRadius: radius.md, borderWidth: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  sectionTitle: { paddingHorizontal: space.lg, marginBottom: space.sm },
  pad: { paddingHorizontal: space.lg, gap: space.sm },
  skeleton: { borderRadius: radius.lg },
  timelineItem: { flexDirection: 'row', paddingHorizontal: space.lg, marginBottom: space.sm },
  timeCol: { width: 58, alignItems: 'center', paddingTop: space.sm },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 6 },
  line: { position: 'absolute', top: 44, bottom: -space.sm - 12, width: 2 },
  apptCard: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center' },
  apptText: { flex: 1, marginLeft: space.sm, gap: 4 },
  apptFoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.sm },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, paddingHorizontal: space.xl, paddingTop: space.sm },
  grabber: { width: 44, height: 5, borderRadius: 3, alignSelf: 'center', marginBottom: space.lg },
  details: { marginVertical: space.md },
  detailRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  detailIcon: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: space.sm },
  close: { marginTop: space.xs },
});

export default ScheduleScreen;
