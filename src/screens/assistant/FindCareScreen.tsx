import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Linking, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme, space, radius, fonts, specialtyHue, specialtyIcon, shortSpecialty, withAlpha } from '../../theme';
import { AppText, Avatar, Button, Card, IconButton, PressScale, Reveal, Screen } from '../../ui';
import { formatDay, formatSlot } from '../../utilis/format';
import { errorMessage } from '../../utilis/api';
import { CareResult, CareSuggestion, findCare } from './findCareApi';

/** International mobile emergency number; reaches local services in the UK, EU, India and most networks. */
export const EMERGENCY_NUMBER = '112';
const CONSENT_KEY = 'aiFindCareConsent';

const EXAMPLES = [
  'Chest tightness when I exercise',
  'Itchy rash for a week',
  'My child has a fever since yesterday',
  'Anxious and not sleeping well',
  'Knee pain, tomorrow morning please',
];

interface Turn { id: number; message: string; result?: CareResult; error?: string }

const Dot: React.FC<{ delay: number }> = ({ delay }) => {
  const { colors } = useTheme();
  const y = useSharedValue(0);
  useEffect(() => {
    y.value = withDelay(delay, withRepeat(withSequence(withTiming(-4, { duration: 260 }), withTiming(0, { duration: 260 })), -1));
  }, [delay, y]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return <Animated.View style={[styles.dot, { backgroundColor: colors.primary }, style]} />;
};

const Thinking: React.FC = () => {
  const { colors } = useTheme();
  return (
    <Animated.View entering={FadeInUp} style={[styles.botBubble, styles.thinking, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Dot delay={0} /><Dot delay={120} /><Dot delay={240} />
      <AppText variant="caption" color="textMuted" style={styles.thinkingText}>Finding the right doctor...</AppText>
    </Animated.View>
  );
};

const whenLabel = (u: { day: string | null; timeOfDay: string }) => {
  const day = u.day ? formatDay(u.day) : 'Soonest';
  return u.timeOfDay === 'any' ? day : `${day} · ${u.timeOfDay[0].toUpperCase()}${u.timeOfDay.slice(1)}`;
};

const EmergencyCard: React.FC<{ result: Extract<CareResult, { type: 'emergency' }> }> = ({ result }) => {
  const { colors } = useTheme();
  return (
    <Animated.View entering={FadeInDown.springify().damping(16)} style={[styles.emergency, { backgroundColor: colors.dangerSoft, borderColor: colors.danger }]}>
      <View style={styles.row}>
        <View style={[styles.emIcon, { backgroundColor: colors.danger }]}>
          <Icon name={result.crisis ? 'heart' : 'warning'} size={22} color="#FFFFFF" />
        </View>
        <AppText variant="h3" color="danger" style={styles.flex}>
          {result.crisis ? "You don't have to face this alone" : 'This could be an emergency'}
        </AppText>
      </View>
      <AppText variant="body" style={styles.emText}>
        {result.crisis
          ? 'If you might act on these thoughts, please call emergency services now, or reach a crisis line or someone you trust. You deserve support right away.'
          : 'Please do not wait for an appointment. Call emergency services now or go to your nearest emergency department.'}
      </AppText>
      {result.reasons.length ? (
        <AppText variant="caption" color="textMuted" style={styles.emReasons}>Because you mentioned: {result.reasons.join(', ').toLowerCase()}</AppText>
      ) : null}
      <Button
        title={`Call emergency services (${EMERGENCY_NUMBER})`}
        icon="call"
        variant="critical"
        onPress={() => Linking.openURL(`tel:${EMERGENCY_NUMBER}`)}
        style={styles.emCta}
      />
    </Animated.View>
  );
};

/** One doctor with their offered times as chips; tapping a time starts booking it. */
const DoctorOption: React.FC<{ options: CareSuggestion[]; index: number; onBook: (s: CareSuggestion) => void }> = ({ options, index, onBook }) => {
  const { colors } = useTheme();
  const d = options[0].doctor;
  return (
    <Reveal index={index}>
      <Card>
        <View style={styles.row}>
          <Avatar name={d.fullName} uri={d.profileImage} size={46} />
          <View style={styles.sugText}>
            <AppText variant="bodyStrong" numberOfLines={1}>{d.fullName}</AppText>
            <AppText variant="caption" color="textMuted" numberOfLines={1}>
              {shortSpecialty(d.specialization)}{d.experience ? ` · ${d.experience} yrs` : ''}
              {d.languages && d.languages.length > 1 ? ` · ${d.languages.join(', ')}` : ''}
            </AppText>
          </View>
        </View>
        <AppText variant="caption" color="textMuted" style={styles.pick}>Tap a time to book</AppText>
        <View style={styles.times}>
          {options.map(s => (
            <PressScale
              key={`${s.date}-${s.slot}`}
              onPress={() => onBook(s)}
              accessibilityRole="button"
              accessibilityLabel={`Book ${d.fullName}, ${formatDay(s.date)} at ${formatSlot(s.slot)}`}
              style={[styles.time, { backgroundColor: colors.primarySoft, borderColor: colors.primary }]}
            >
              <AppText variant="caption" color="textMuted">{formatDay(s.date)}</AppText>
              <AppText variant="label" color="primary">{formatSlot(s.slot).split(' - ')[0]}</AppText>
            </PressScale>
          ))}
        </View>
      </Card>
    </Reveal>
  );
};

/** Suggestions grouped per doctor, in order of each doctor's earliest time. */
const byDoctor = (suggestions: CareSuggestion[]) => {
  const groups = new Map<string, CareSuggestion[]>();
  suggestions.forEach(s => groups.set(s.doctor.userId, [...(groups.get(s.doctor.userId) ?? []), s]));
  return [...groups.values()];
};

const ResultView: React.FC<{ result: CareResult; onBook: (s: CareSuggestion, summary: string) => void; onBrowse: (specialty: string) => void }> = ({ result, onBook, onBrowse }) => {
  const { colors } = useTheme();
  if (result.type === 'emergency') {
    return <EmergencyCard result={result} />;
  }
  const u = result.understanding;
  const hue = specialtyHue(u.specialty);
  const prefs = [
    u.doctorGender ? `${u.doctorGender} doctor` : null,
    u.language ? `Speaks ${u.language}` : null,
  ].filter(Boolean) as string[];
  return (
    <View style={styles.result}>
      {/* Full width: a content-sized bubble collapsed its flexible text column. */}
      <Animated.View entering={FadeInDown.springify().damping(16)} style={[styles.botBubble, styles.matchBubble, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.row}>
          <View style={[styles.specIcon, { backgroundColor: withAlpha(hue, 0.14) }]}>
            <MCI name={specialtyIcon(u.specialty)} size={22} color={hue} />
          </View>
          <View style={styles.flex}>
            <AppText variant="caption" color="textMuted">Best match</AppText>
            <AppText variant="h3">{shortSpecialty(u.specialty)}</AppText>
          </View>
          {u.urgency === 'urgent' ? (
            <View style={[styles.tag, { backgroundColor: colors.warningSoft }]}>
              <AppText variant="caption" rawColor={colors.warning}>See soon</AppText>
            </View>
          ) : null}
        </View>
        <View style={styles.tags}>
          <View style={[styles.tag, { backgroundColor: colors.surfaceAlt }]}>
            <Icon name="calendar-outline" size={12} color={colors.textMuted} />
            <AppText variant="caption" color="textMuted" style={styles.tagText}>{whenLabel(u)}</AppText>
          </View>
          {prefs.map(p => (
            <View key={p} style={[styles.tag, { backgroundColor: colors.surfaceAlt }]}>
              <AppText variant="caption" color="textMuted">{p}</AppText>
            </View>
          ))}
        </View>
        {result.widened ? (
          <AppText variant="caption" color="textMuted" style={styles.note}>Nothing was free exactly then, so here are the soonest times.</AppText>
        ) : null}
        {result.relaxed.length ? (
          <AppText variant="caption" color="textMuted" style={styles.note}>
            No doctor matched {result.relaxed.map(r => (r === 'language' ? `"speaks ${u.language}"` : `"${u.doctorGender?.toLowerCase()} doctor"`)).join(' or ')}, so these are the closest matches.
          </AppText>
        ) : null}
      </Animated.View>

      {result.suggestions.length ? (
        byDoctor(result.suggestions).map((group, i) => (
          <DoctorOption key={group[0].doctor.userId} options={group} index={i} onBook={s => onBook(s, u.summary)} />
        ))
      ) : (
        <Card style={styles.none}>
          <AppText variant="bodyStrong">No free times in the next week</AppText>
          <AppText variant="caption" color="textMuted" style={styles.noneText}>Browse {shortSpecialty(u.specialty).toLowerCase()} doctors to see their schedules.</AppText>
          <Button title="Browse doctors" variant="soft" size="md" onPress={() => onBrowse(u.specialty)} style={styles.noneCta} />
        </Card>
      )}
      <AppText variant="caption" color="textSubtle" style={styles.disclaimer}>{result.disclaimer}</AppText>
    </View>
  );
};

const FindCareScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  // Optional message to start with, e.g. a Home search that found nothing.
  const initialMessage: string | undefined = useRoute<any>().params?.message;
  const startedWith = useRef(false);
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [consented, setConsented] = useState<boolean | null>(null);
  const [text, setText] = useState('');
  const [turns, setTurns] = useState<Turn[]>([]);
  const [busy, setBusy] = useState(false);
  const scroll = useRef<ScrollView>(null);
  const turnY = useRef<Record<number, number>>({});
  const input = useRef<TextInput>(null);

  useEffect(() => {
    AsyncStorage.getItem(CONSENT_KEY).then(v => setConsented(v === 'true')).catch(() => setConsented(false));
  }, []);

  useEffect(() => {
    if (consented && initialMessage && !startedWith.current) {
      startedWith.current = true;
      send(initialMessage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consented, initialMessage]);

  const accept = () => {
    setConsented(true);
    AsyncStorage.setItem(CONSENT_KEY, 'true').catch(() => {});
  };

  const send = async (raw?: string) => {
    const message = (raw ?? text).trim();
    if (message.length < 3 || busy) {
      return;
    }
    const id = Date.now();
    setTurns(t => [...t, { id, message }]);
    setText('');
    setBusy(true);
    try {
      const result = await findCare(message);
      setTurns(t => t.map(x => (x.id === id ? { ...x, result } : x)));
    } catch (e: any) {
      setTurns(t => t.map(x => (x.id === id ? { ...x, error: errorMessage(e, 'Something went wrong. Please try again.') } : x)));
    } finally {
      setBusy(false);
      // Show the start of this answer (the patient's message and the match), not the end.
      setTimeout(() => scroll.current?.scrollTo({ y: Math.max(0, (turnY.current[id] ?? 0) - space.sm), animated: true }), 150);
    }
  };

  // Hands over to the booking screen with everything pre-filled; the patient still
  // reviews and confirms there. Nothing is booked from this screen.
  const book = (s: CareSuggestion, summary: string) =>
    navigation.navigate('AppointmentBooking', {
      doctor: { ...s.doctor, name: s.doctor.fullName },
      date: s.date,
      slot: s.slot,
      healthIssue: summary,
      autoReview: true,
    });

  return (
    <Screen edges={['top']}>
      <View style={styles.header}>
        <IconButton icon="chevron-back" label="Back" onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <View style={styles.row}>
            <AppText variant="h2">Find care</AppText>
            <View style={[styles.aiBadge, { backgroundColor: colors.primarySoft }]}>
              <Icon name="sparkles" size={11} color={colors.primary} />
              <AppText variant="caption" color="primary" style={styles.aiText}>AI</AppText>
            </View>
          </View>
          <AppText variant="caption" color="textMuted">Tell us how you feel - we'll find a doctor and a time</AppText>
        </View>
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView ref={scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Reveal>
            <View style={[styles.botBubble, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <AppText variant="body">
                Hi! Describe what's going on and, if you like, when you'd prefer to be seen. I'll suggest the right kind of doctor and their next free times.
              </AppText>
            </View>
          </Reveal>

          {consented === false ? (
            <Reveal delay={120}>
              <Card style={styles.consent}>
                <View style={styles.row}>
                  <Icon name="shield-checkmark" size={22} color={colors.primary} />
                  <AppText variant="bodyStrong" style={styles.consentTitle}>Before you start</AppText>
                </View>
                <AppText variant="caption" color="textMuted" style={styles.consentText}>
                  Your message is sent to our AI service only to suggest a doctor. Please leave out your name and other personal details.
                  This is not a diagnosis, and you always confirm before anything is booked.
                </AppText>
                <Button title="I understand" size="md" onPress={accept} style={styles.consentCta} />
              </Card>
            </Reveal>
          ) : null}

          {consented && turns.length === 0 ? (
            <Reveal delay={120} style={styles.examples}>
              {EXAMPLES.map(e => (
                <PressScale
                  key={e}
                  onPress={() => send(e)}
                  accessibilityRole="button"
                  style={[styles.example, { borderColor: colors.border, backgroundColor: colors.surface }]}
                >
                  <AppText variant="label" color="primary">{e}</AppText>
                </PressScale>
              ))}
            </Reveal>
          ) : null}

          {turns.map(t => (
            <View key={t.id} onLayout={e => { turnY.current[t.id] = e.nativeEvent.layout.y; }}>
              <Animated.View entering={FadeInUp.springify().damping(18)} style={[styles.userBubble, { overflow: 'hidden' }]}>
                <LinearGradient colors={colors.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
                <AppText variant="body" rawColor="#FFFFFF">{t.message}</AppText>
              </Animated.View>
              {t.result ? (
                <ResultView
                  result={t.result}
                  onBook={book}
                  onBrowse={specialty => navigation.navigate('DoctorListScreen', { category: specialty })}
                />
              ) : t.error ? (
                <View style={[styles.botBubble, { backgroundColor: colors.dangerSoft, borderColor: colors.dangerSoft }]}>
                  <AppText variant="body" color="danger">{t.error}</AppText>
                </View>
              ) : (
                <Thinking />
              )}
            </View>
          ))}
        </ScrollView>

        <View style={[styles.composer, { backgroundColor: colors.surface, borderTopColor: colors.border, paddingBottom: Math.max(insets.bottom, space.sm) }]}>
          <TextInput
            ref={input}
            value={text}
            onChangeText={setText}
            placeholder={consented ? 'e.g. Rash on my arm, tomorrow afternoon' : 'Tap "I understand" to start'}
            placeholderTextColor={colors.textSubtle}
            editable={!!consented && !busy}
            multiline
            maxLength={1000}
            style={[styles.input, { color: colors.text, backgroundColor: colors.surfaceAlt }]}
            accessibilityLabel="Describe how you feel"
          />
          <PressScale
            onPress={() => send()}
            disabled={!consented || busy || text.trim().length < 3}
            accessibilityRole="button"
            accessibilityLabel="Send"
            style={[styles.send, { opacity: !consented || busy || text.trim().length < 3 ? 0.4 : 1 }]}
          >
            <LinearGradient colors={colors.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
            <Icon name="arrow-up" size={20} color="#FFFFFF" />
          </PressScale>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: space.lg, paddingTop: space.xs, paddingBottom: space.sm },
  headerText: { flex: 1, marginLeft: space.sm },
  aiBadge: { flexDirection: 'row', alignItems: 'center', marginLeft: space.xs, paddingHorizontal: 7, paddingVertical: 2, borderRadius: radius.pill },
  aiText: { marginLeft: 3, fontFamily: fonts.bold },
  content: { paddingHorizontal: space.lg, paddingBottom: space.xl, gap: space.sm },
  botBubble: { alignSelf: 'flex-start', maxWidth: '92%', padding: space.md, borderRadius: radius.lg, borderTopLeftRadius: 6, borderWidth: StyleSheet.hairlineWidth },
  userBubble: { alignSelf: 'flex-end', maxWidth: '85%', paddingHorizontal: space.md, paddingVertical: space.sm, borderRadius: radius.lg, borderTopRightRadius: 6, marginVertical: space.xs },
  matchBubble: { alignSelf: 'stretch', maxWidth: '100%' },
  thinking: { flexDirection: 'row', alignItems: 'center' },
  thinkingText: { marginLeft: space.xs },
  dot: { width: 7, height: 7, borderRadius: 4, marginRight: 4 },
  consent: {},
  consentTitle: { marginLeft: space.xs },
  consentText: { marginTop: space.xs, lineHeight: 18 },
  consentCta: { marginTop: space.md },
  examples: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  example: { paddingHorizontal: 12, paddingVertical: 9, borderRadius: radius.pill, borderWidth: 1 },
  result: { gap: space.sm },
  specIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: space.sm },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: space.sm },
  tag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 9, paddingVertical: 4, borderRadius: radius.pill },
  tagText: { marginLeft: 4 },
  note: { marginTop: space.xs },
  pick: { marginTop: space.sm, marginBottom: 6 },
  times: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  time: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: radius.md, borderWidth: 1, alignItems: 'center', minWidth: 84 },
  sugText: { flex: 1, marginLeft: space.sm, gap: 2 },
  none: {},
  noneText: { marginTop: 4 },
  noneCta: { marginTop: space.sm, alignSelf: 'flex-start' },
  disclaimer: { marginTop: 2, marginLeft: 2 },
  emergency: { borderWidth: 1.5, borderRadius: radius.lg, padding: space.md },
  emIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: space.sm },
  emText: { marginTop: space.sm },
  emReasons: { marginTop: space.xs },
  emCta: { marginTop: space.md },
  composer: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: space.md, paddingTop: space.sm, borderTopWidth: StyleSheet.hairlineWidth },
  input: { flex: 1, minHeight: 46, maxHeight: 120, borderRadius: radius.lg, paddingHorizontal: space.md, paddingTop: 13, paddingBottom: 13, fontFamily: fonts.medium, fontSize: 15 },
  send: { width: 46, height: 46, borderRadius: 23, marginLeft: space.xs, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
});

export default FindCareScreen;
