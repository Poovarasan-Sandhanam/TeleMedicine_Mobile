import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, SlideInDown, ZoomIn } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { bookAppointment } from '../../redux/slices/appointmentSlice';
import { fetchDoctorDetails } from '../../redux/slices/doctorSlice';
import { useTheme, space, radius, elevation, specialtyHue, specialtyIcon, shortSpecialty, withAlpha } from '../../theme';
import { AppText, Avatar, Button, Card, Chip, IconButton, PressScale, Reveal, Screen, Skeleton, TextField } from '../../ui';
import { formatSlot } from '../../utilis/format';

interface Slot { slotTiming: string; isBooked: boolean }

const DAYS_AHEAD = 14;
const startHour = (slot: string) => Number(slot.split('-')[0]);

const DayChip: React.FC<{ day: moment.Moment; selected: boolean; onPress: () => void }> = ({ day, selected, onPress }) => {
  const { colors } = useTheme();
  const isToday = day.isSame(moment(), 'day');
  const label = isToday ? 'Today' : day.format('ddd');
  return (
    <PressScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={day.format('dddd D MMMM')}
      style={[styles.day, { backgroundColor: colors.surface, borderColor: selected ? 'transparent' : colors.border }]}
    >
      {selected ? (
        <LinearGradient colors={colors.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      ) : null}
      <AppText variant="caption" rawColor={selected ? 'rgba(255,255,255,0.85)' : colors.textMuted}>{label}</AppText>
      <AppText variant="h2" rawColor={selected ? '#FFFFFF' : colors.text}>{day.format('D')}</AppText>
      <AppText variant="caption" rawColor={selected ? 'rgba(255,255,255,0.85)' : colors.textSubtle}>{day.format('MMM')}</AppText>
    </PressScale>
  );
};

const SummaryRow: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => {
  const { colors } = useTheme();
  return (
    <View style={styles.summaryRow}>
      <View style={[styles.summaryIcon, { backgroundColor: colors.primarySoft }]}>
        <Icon name={icon} size={18} color={colors.primary} />
      </View>
      <View style={styles.flex}>
        <AppText variant="caption" color="textMuted">{label}</AppText>
        <AppText variant="bodyStrong" numberOfLines={2}>{value}</AppText>
      </View>
    </View>
  );
};

const AppointmentBookingScreen: React.FC<any> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const route = useRoute<any>();
  // From "Find care" the day, time and reason arrive pre-chosen (autoReview opens the
  // review sheet); the patient still confirms before anything is booked.
  const { doctor, date: presetDate, slot: presetSlot, healthIssue: presetIssue, autoReview } = route.params || {};
  const doctorId = doctor?.userId || '';
  const doctorName = doctor?.fullName ?? doctor?.name ?? 'Doctor';
  const hue = specialtyHue(doctor?.specialization);

  const days = useMemo(() => Array.from({ length: DAYS_AHEAD }, (_, i) => moment().startOf('day').add(i, 'days')), []);
  const [day, setDay] = useState(() => days.find(d => d.format('YYYY-MM-DD') === presetDate) ?? days[0]);
  const [slot, setSlot] = useState('');
  const [healthIssue, setHealthIssue] = useState<string>(presetIssue ?? '');
  const pendingSlot = useRef<string | undefined>(presetSlot);
  const sawFreshLoad = useRef(false);
  const [notes, setNotes] = useState('');
  const [sheet, setSheet] = useState<'closed' | 'review' | 'done'>('closed');
  const [booking, setBooking] = useState(false);
  const [bookError, setBookError] = useState<string | null>(null);

  const { doctorDetails, loading } = useAppSelector(s => s.doctors);
  // Local calendar date. toISOString() converted to UTC first, so near midnight it
  // produced the neighbouring day.
  const dateKey = day.format('YYYY-MM-DD');

  // Slots load as soon as a day is chosen - there used to be a separate
  // "Check Availability" step before any times appeared.
  useEffect(() => {
    if (doctorId) {
      setSlot('');
      dispatch(fetchDoctorDetails({ id: doctorId, selectedDate: dateKey }) as any);
    }
  }, [dispatch, doctorId, dateKey]);

  const slots: Slot[] = doctorDetails?.slots ?? [];
  const isToday = day.isSame(moment(), 'day');
  const nowHour = new Date().getHours();
  // Times earlier today can no longer be attended.
  const isPast = (s: Slot) => isToday && startHour(s.slotTiming) <= nowHour;
  const openCount = slots.filter(s => !s.isBooked && !isPast(s)).length;

  // Apply a pre-chosen slot once fresh availability for this doctor and day has loaded
  // (not a list left in the store from a previous screen), and only if still free.
  useEffect(() => {
    if (loading) {
      sawFreshLoad.current = true;
      return;
    }
    const wanted = pendingSlot.current;
    if (!wanted || !sawFreshLoad.current) {
      return;
    }
    pendingSlot.current = undefined;
    const match = slots.find(x => x.slotTiming === wanted);
    if (match && !match.isBooked && !isPast(match)) {
      setSlot(wanted);
      if (autoReview && healthIssue.trim()) {
        setSheet('review');
      }
    } else {
      Toast.show({ type: 'info', text1: 'That time was just taken', text2: 'Please pick another time.' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, slots]);

  const ready = !!doctorId && !!slot && healthIssue.trim().length > 0;
  const whenLabel = `${isToday ? 'Today' : day.format('ddd D MMM')}${slot ? ` · ${formatSlot(slot)}` : ''}`;

  const confirm = async () => {
    if (booking) {
      return;
    }
    setBooking(true);
    setBookError(null);
    try {
      await dispatch(bookAppointment({ doctorId, date: dateKey, time: slot, healthIssue: healthIssue.trim(), notes }) as any).unwrap();
      setSheet('done');
    } catch (err: any) {
      setBookError(typeof err === 'string' ? err : err?.message || 'Failed to book appointment.');
    } finally {
      setBooking(false);
    }
  };

  const finish = () => {
    setSheet('closed');
    navigation.navigate('Home', { screen: 'MyBooking' });
  };

  return (
    <Screen edges={['top']}>
      <View style={styles.header}>
        <IconButton icon="chevron-back" label="Back" onPress={() => navigation.goBack()} />
        <AppText variant="h2" style={styles.headerTitle}>Book an Appointment</AppText>
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Reveal>
            <Card style={styles.doctor}>
              <Avatar name={doctorName} uri={doctor?.profileImage} size={60} ring />
              <View style={styles.doctorInfo}>
                <AppText variant="h3" numberOfLines={1}>{doctorName}</AppText>
                <View style={[styles.spec, { backgroundColor: withAlpha(hue, 0.12) }]}>
                  <MCI name={specialtyIcon(doctor?.specialization)} size={13} color={hue} />
                  <AppText variant="caption" rawColor={hue} style={styles.specText}>{shortSpecialty(doctor?.specialization) || 'Specialist'}</AppText>
                </View>
                {doctor?.experience ? (
                  <AppText variant="caption" color="textMuted" style={styles.exp}>{doctor.experience} years of experience</AppText>
                ) : null}
              </View>
            </Card>
          </Reveal>

          <AppText variant="h3" style={styles.section}>Choose a day</AppText>
          <FlatList
            horizontal
            data={days}
            keyExtractor={d => d.format('YYYY-MM-DD')}
            showsHorizontalScrollIndicator={false}
            style={styles.bleed}
            contentContainerStyle={styles.daysRow}
            renderItem={({ item, index }) => (
              <Reveal index={index} from="zoom">
                <DayChip day={item} selected={item.isSame(day, 'day')} onPress={() => setDay(item)} />
              </Reveal>
            )}
          />

          <View style={styles.sectionRow}>
            <AppText variant="h3">Available times</AppText>
            {!loading && slots.length ? (
              <AppText variant="caption" color="textMuted">{openCount} open</AppText>
            ) : null}
          </View>
          {loading && !slots.length ? (
            <View style={styles.slots}>
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} width="31%" height={44} />)}
            </View>
          ) : slots.length === 0 ? (
            <Card style={styles.noSlots}>
              <Icon name="moon-outline" size={22} color={colors.textMuted} />
              <AppText variant="body" color="textMuted" style={styles.noSlotsText}>Not available on this day.</AppText>
            </Card>
          ) : (
            <>
            {openCount === 0 ? (
              <AppText variant="caption" color="textMuted" style={styles.slotHint}>
                {slots.some(s => !s.isBooked)
                  ? 'No more times left today - try another day.'
                  : 'Fully booked on this day - try another day.'}
              </AppText>
            ) : null}
            <View style={styles.slots}>
              {slots.map((s, i) => (
                <Reveal key={s.slotTiming} index={i} style={styles.slotWrap}>
                  <Chip
                    label={formatSlot(s.slotTiming).split(' - ')[0]}
                    sublabel={s.isBooked ? '' : undefined}
                    selected={slot === s.slotTiming}
                    disabled={s.isBooked || isPast(s)}
                    onPress={() => setSlot(s.slotTiming)}
                  />
                </Reveal>
              ))}
            </View>
            </>
          )}

          <AppText variant="h3" style={styles.section}>What brings you in?</AppText>
          <TextField
            icon="medkit-outline"
            placeholder="e.g. Chest pain after exercise"
            value={healthIssue}
            onChangeText={setHealthIssue}
            accessibilityLabel="Health issue"
          />
          <TextField
            icon="create-outline"
            placeholder="Anything else the doctor should know? (optional)"
            value={notes}
            onChangeText={setNotes}
            multiline
            style={styles.notes}
            accessibilityLabel="Notes"
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.bar, { backgroundColor: colors.surface, borderTopColor: colors.border, paddingBottom: Math.max(insets.bottom, space.md) }]}>
        <View style={styles.flex}>
          <AppText variant="caption" color="textMuted">Your visit</AppText>
          <AppText variant="bodyStrong" numberOfLines={1}>{slot ? whenLabel : 'Pick a time'}</AppText>
        </View>
        <Button
          title="Review Booking"
          size="md"
          disabled={!ready}
          onPress={() => { setBookError(null); setSheet('review'); }}
          style={styles.barButton}
          testID="review-booking"
        />
      </View>

      <Modal visible={sheet !== 'closed'} transparent animationType="fade" onRequestClose={() => sheet === 'review' && setSheet('closed')}>
        <Pressable
          style={[styles.backdrop, { backgroundColor: colors.overlay }]}
          onPress={() => sheet === 'review' && !booking && setSheet('closed')}
          accessibilityLabel="Close"
        />
        <Animated.View
          entering={SlideInDown.springify().damping(18).stiffness(180)}
          style={[styles.sheet, { backgroundColor: colors.surface, paddingBottom: Math.max(insets.bottom, space.lg) }, elevation(colors.shadow, 3)]}
        >
          <View style={[styles.grabber, { backgroundColor: colors.border }]} />
          {sheet === 'done' ? (
            <View style={styles.done}>
              <Animated.View entering={ZoomIn.springify().damping(10)} style={[styles.doneHalo, { backgroundColor: colors.successSoft }]}>
                <View style={[styles.doneCore, { backgroundColor: colors.success }]}>
                  <Icon name="checkmark" size={40} color="#FFFFFF" />
                </View>
              </Animated.View>
              <Animated.View entering={FadeIn.delay(200)}>
                <AppText variant="h2" center style={styles.doneTitle}>You're booked!</AppText>
                <AppText variant="body" color="textMuted" center>
                  {doctorName} · {whenLabel}
                </AppText>
              </Animated.View>
              <Button title="View my bookings" icon="bookmarks-outline" onPress={finish} style={styles.sheetCta} />
            </View>
          ) : (
            <>
              <AppText variant="h2">Review Appointment</AppText>
              <AppText variant="body" color="textMuted" style={styles.sheetSub}>Check the details before you confirm.</AppText>
              <SummaryRow icon="person-outline" label="Doctor" value={`${doctorName}${doctor?.specialization ? ` · ${shortSpecialty(doctor.specialization)}` : ''}`} />
              <SummaryRow icon="calendar-outline" label="When" value={whenLabel} />
              <SummaryRow icon="medkit-outline" label="Reason" value={healthIssue.trim()} />
              {notes.trim() ? <SummaryRow icon="create-outline" label="Notes" value={notes.trim()} /> : null}
              {bookError ? (
                <View style={[styles.error, { backgroundColor: colors.dangerSoft }]}>
                  <Icon name="alert-circle" size={18} color={colors.danger} />
                  <AppText variant="label" color="danger" style={styles.errorText}>{bookError}</AppText>
                </View>
              ) : null}
              <Button title="Confirm Booking" icon="checkmark-circle-outline" loading={booking} onPress={confirm} style={styles.sheetCta} />
              <Button title="Go back" variant="ghost" size="md" onPress={() => setSheet('closed')} disabled={booking} style={styles.sheetSecondary} />
            </>
          )}
        </Animated.View>
      </Modal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: space.lg, paddingTop: space.xs, paddingBottom: space.sm },
  headerTitle: { marginLeft: space.sm },
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxxl },
  doctor: { flexDirection: 'row', alignItems: 'center' },
  doctorInfo: { flex: 1, marginLeft: space.md },
  spec: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill, marginTop: 4 },
  specText: { marginLeft: 4 },
  exp: { marginTop: 4 },
  section: { marginTop: space.xl, marginBottom: space.sm },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: space.xl, marginBottom: space.sm },
  bleed: { marginHorizontal: -space.lg },
  daysRow: { paddingHorizontal: space.lg, gap: space.xs },
  day: { width: 64, height: 86, borderRadius: radius.lg, borderWidth: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  slots: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slotWrap: { width: '31.5%' },
  noSlots: { flexDirection: 'row', alignItems: 'center' },
  noSlotsText: { marginLeft: space.sm, flex: 1 },
  notes: { minHeight: 70, textAlignVertical: 'top' },
  slotHint: { marginBottom: space.sm },
  bar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: space.lg, paddingTop: space.md, borderTopWidth: StyleSheet.hairlineWidth },
  barButton: { minWidth: 170, marginLeft: space.md },
  backdrop: { ...StyleSheet.absoluteFillObject },
  sheet: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, paddingHorizontal: space.xl, paddingTop: space.sm,
  },
  grabber: { width: 44, height: 5, borderRadius: 3, alignSelf: 'center', marginBottom: space.lg },
  sheetSub: { marginTop: 2, marginBottom: space.md },
  summaryRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: space.xs },
  summaryIcon: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: space.sm },
  error: { flexDirection: 'row', alignItems: 'center', padding: space.sm, borderRadius: radius.md, marginTop: space.sm },
  errorText: { marginLeft: space.xs, flex: 1 },
  sheetCta: { marginTop: space.lg },
  sheetSecondary: { marginTop: space.xs },
  done: { alignItems: 'center', paddingTop: space.sm },
  doneHalo: { width: 120, height: 120, borderRadius: 60, alignItems: 'center', justifyContent: 'center' },
  doneCore: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  doneTitle: { marginTop: space.lg, marginBottom: 4 },
});

export default AppointmentBookingScreen;
