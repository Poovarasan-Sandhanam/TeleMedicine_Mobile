import React, { useRef, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut, LinearTransition, ZoomIn } from 'react-native-reanimated';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addPrescription } from '../../redux/slices/prescriptionSlice';
import { useTheme, space, radius, elevation } from '../../theme';
import { AppText, Avatar, Button, Card, IconButton, Reveal, Screen, TextField } from '../../ui';

interface Medication { name: string; dosage: string; frequency: string; duration: string }
const EMPTY_MED: Medication = { name: '', dosage: '', frequency: '', duration: '' };

const PrescriptionForm = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const route = useRoute();
  // Opened from an appointment in the doctor's schedule. The server works out the
  // doctor and patient itself, so only the appointment is needed.
  const { appointmentId, patientName: initialName } = (route.params as any) || {};
  const { loading } = useAppSelector((state: any) => state.prescription);

  const [patientName, setPatientName] = useState(initialName || '');
  const [age, setAge] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [meds, setMeds] = useState<Medication[]>([]);
  const [med, setMed] = useState<Medication>(EMPTY_MED);
  const [done, setDone] = useState(false);
  const dosageRef = useRef<TextInput>(null);
  const frequencyRef = useRef<TextInput>(null);
  const durationRef = useRef<TextInput>(null);

  const symptomList = symptoms.split(',').map(s => s.trim()).filter(Boolean);
  const medReady = !!(med.name.trim() && med.dosage.trim() && med.frequency.trim() && med.duration.trim());
  const canSubmit = !!appointmentId && diagnosis.trim().length > 0 && meds.length > 0;

  const addMed = () => {
    if (!medReady) {
      Toast.show({ type: 'error', text1: 'Complete the medicine', text2: 'Name, dosage, frequency and duration are all needed.' });
      return;
    }
    setMeds(prev => [...prev, { name: med.name.trim(), dosage: med.dosage.trim(), frequency: med.frequency.trim(), duration: med.duration.trim() }]);
    setMed(EMPTY_MED);
  };

  const submit = async () => {
    if (!appointmentId) {
      Toast.show({ type: 'error', text1: 'Open this from an appointment in your schedule.' });
      return;
    }
    try {
      // unwrap() throws on failure; the old form read a stale `error` after
      // awaiting and reported success even when the save failed.
      await dispatch(addPrescription({
        appointmentId,
        patientName: patientName.trim(),
        age: age ? Number(age) : undefined,
        symptoms: symptomList,
        diagnosis: diagnosis.trim(),
        notes: notes.trim(),
        date: new Date().toISOString(),
        medications: meds,
      }) as any).unwrap();
      setDone(true);
    } catch (err: any) {
      Toast.show({ type: 'error', text1: 'Could not save', text2: typeof err === 'string' ? err : err?.message || 'Please try again.' });
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <IconButton icon="chevron-back" label="Back" onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <AppText variant="h2">Write Prescription</AppText>
          <AppText variant="caption" color="textMuted">{moment().format('dddd D MMMM')}</AppText>
        </View>
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Reveal>
            <Card style={styles.patient}>
              <Avatar name={patientName || 'Patient'} size={48} />
              <View style={styles.flex}>
                <AppText variant="caption" color="textMuted">Patient</AppText>
                <AppText variant="h3" numberOfLines={1}>{patientName || 'Patient'}</AppText>
              </View>
            </Card>
          </Reveal>

          <Reveal index={1}>
            <Card style={styles.section}>
              <View style={styles.pair}>
                <View style={styles.grow}><TextField label="Patient name" icon="person-outline" value={patientName} onChangeText={setPatientName} /></View>
                <View style={styles.age}><TextField label="Age" value={age} onChangeText={setAge} keyboardType="number-pad" /></View>
              </View>
              <TextField label="Diagnosis" icon="pulse-outline" placeholder="e.g. Tension headache" value={diagnosis} onChangeText={setDiagnosis} />
              <TextField label="Symptoms" icon="list-outline" placeholder="Separate with commas" value={symptoms} onChangeText={setSymptoms} />
              {symptomList.length ? (
                <View style={styles.chips}>
                  {symptomList.map(s => (
                    <Animated.View key={s} entering={ZoomIn.springify()} style={[styles.chip, { backgroundColor: colors.primarySoft }]}>
                      <AppText variant="caption" color="primary">{s}</AppText>
                    </Animated.View>
                  ))}
                </View>
              ) : null}
            </Card>
          </Reveal>

          <Reveal index={2}>
            <Card style={styles.section}>
              <View style={styles.medHead}>
                <AppText variant="h3">Medicines</AppText>
                <AppText variant="caption" color="textMuted">{meds.length} added</AppText>
              </View>
              {meds.map((m, i) => (
                <Animated.View
                  key={`${m.name}-${i}`}
                  entering={FadeIn.springify()}
                  exiting={FadeOut.duration(150)}
                  layout={LinearTransition.springify()}
                  style={[styles.med, { backgroundColor: colors.surfaceAlt }]}
                >
                  <View style={[styles.pill, { backgroundColor: colors.successSoft }]}>
                    <MCI name="pill" size={18} color={colors.success} />
                  </View>
                  <View style={styles.flex}>
                    <AppText variant="bodyStrong">{m.name} <AppText variant="body" color="textMuted">· {m.dosage}</AppText></AppText>
                    <AppText variant="caption" color="textMuted">{m.frequency} for {m.duration}</AppText>
                  </View>
                  <Pressable onPress={() => setMeds(prev => prev.filter((_, j) => j !== i))} hitSlop={10} accessibilityRole="button" accessibilityLabel={`Remove ${m.name}`}>
                    <Icon name="close-circle" size={22} color={colors.textSubtle} />
                  </Pressable>
                </Animated.View>
              ))}

              <View style={[styles.addBox, { borderColor: colors.border }]}>
                <TextField icon="medical-outline" placeholder="Medicine name" value={med.name} onChangeText={v => setMed(p => ({ ...p, name: v }))} returnKeyType="next" onSubmitEditing={() => dosageRef.current?.focus()} />
                <View style={styles.pair}>
                  <View style={styles.flex}><TextField ref={dosageRef} placeholder="Dosage" value={med.dosage} onChangeText={v => setMed(p => ({ ...p, dosage: v }))} returnKeyType="next" onSubmitEditing={() => frequencyRef.current?.focus()} /></View>
                  <View style={styles.flex}><TextField ref={frequencyRef} placeholder="How often" value={med.frequency} onChangeText={v => setMed(p => ({ ...p, frequency: v }))} returnKeyType="next" onSubmitEditing={() => durationRef.current?.focus()} /></View>
                </View>
                <TextField ref={durationRef} placeholder="For how long (e.g. 5 days)" value={med.duration} onChangeText={v => setMed(p => ({ ...p, duration: v }))} returnKeyType="done" onSubmitEditing={addMed} />
                <Button title="Add medicine" icon="add" variant="soft" size="md" onPress={addMed} disabled={!medReady} />
              </View>
            </Card>
          </Reveal>

          <Reveal index={3}>
            <Card style={styles.section}>
              <AppText variant="h3" style={styles.notesTitle}>Treatment notes</AppText>
              <TextField placeholder="Advice, follow-up, lifestyle changes..." value={notes} onChangeText={setNotes} multiline style={styles.notes} />
            </Card>
          </Reveal>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.bar, { backgroundColor: colors.surface, borderTopColor: colors.border, paddingBottom: Math.max(insets.bottom, space.md) }]}>
        <Button title="Issue Prescription" icon="checkmark-done" loading={loading} disabled={!canSubmit} onPress={submit} />
        {!canSubmit ? (
          <AppText variant="caption" color="textMuted" center style={styles.barHint}>
            {meds.length === 0 ? 'Add at least one medicine' : 'Add a diagnosis'}
          </AppText>
        ) : null}
      </View>

      <Modal visible={done} transparent animationType="fade" onRequestClose={() => navigation.goBack()}>
        <View style={[styles.doneWrap, { backgroundColor: colors.overlay }]}>
          <Animated.View entering={ZoomIn.springify().damping(14)} style={[styles.doneCard, { backgroundColor: colors.surface }, elevation(colors.shadow, 3)]}>
            <View style={[styles.doneHalo, { backgroundColor: colors.successSoft }]}>
              <View style={[styles.doneCore, { backgroundColor: colors.success }]}>
                <Icon name="checkmark" size={38} color="#FFFFFF" />
              </View>
            </View>
            <AppText variant="h2" center style={styles.doneTitle}>Prescription issued</AppText>
            <AppText variant="body" color="textMuted" center>
              {patientName || 'The patient'} can now view and download it. The appointment is marked completed.
            </AppText>
            <Button title="Back to schedule" onPress={() => { setDone(false); navigation.goBack(); }} style={styles.doneCta} />
          </Animated.View>
        </View>
      </Modal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  grow: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: space.lg, paddingTop: space.xs, paddingBottom: space.sm },
  headerText: { marginLeft: space.sm },
  content: { paddingHorizontal: space.lg, paddingBottom: space.xxxl, gap: space.md },
  patient: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  section: { paddingTop: space.lg },
  pair: { flexDirection: 'row', gap: space.sm },
  age: { width: 96 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: -space.xs, marginBottom: space.xs },
  chip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  medHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: space.sm },
  med: { flexDirection: 'row', alignItems: 'center', padding: space.sm, borderRadius: radius.md, marginBottom: space.xs },
  pill: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: space.sm },
  addBox: { borderWidth: 1.5, borderStyle: 'dashed', borderRadius: radius.lg, padding: space.md, paddingBottom: space.md, marginTop: space.xs },
  notesTitle: { marginBottom: space.sm },
  notes: { minHeight: 90, textAlignVertical: 'top' },
  bar: { paddingHorizontal: space.lg, paddingTop: space.md, borderTopWidth: StyleSheet.hairlineWidth },
  barHint: { marginTop: 6 },
  doneWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.xl },
  doneCard: { width: '100%', borderRadius: radius.xl, padding: space.xl, alignItems: 'center' },
  doneHalo: { width: 110, height: 110, borderRadius: 55, alignItems: 'center', justifyContent: 'center' },
  doneCore: { width: 74, height: 74, borderRadius: 37, alignItems: 'center', justifyContent: 'center' },
  doneTitle: { marginTop: space.lg, marginBottom: space.xs },
  doneCta: { marginTop: space.xl, alignSelf: 'stretch' },
});

export default PrescriptionForm;
