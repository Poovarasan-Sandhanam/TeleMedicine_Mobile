import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import Share from 'react-native-share';
import Toast from 'react-native-toast-message';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getPrescriptions } from '../../redux/slices/prescriptionsSlice';
import { useTheme, space, radius } from '../../theme';
import { AppText, Button, Card, EmptyState, Reveal, Screen, Skeleton } from '../../ui';
import { TAB_BAR_CLEARANCE } from '../../navigation/FloatingTabBar';
import { formatDay } from '../../utilis/format';
import { makePrescriptionPdf } from '../../utilis/prescriptionPdf';

const PrescriptionCard: React.FC<{ item: any; index: number }> = ({ item, index }) => {
  const { colors } = useTheme();
  const [busy, setBusy] = useState(false);

  const download = async () => {
    setBusy(true);
    try {
      const path = await makePrescriptionPdf(item, { primary: colors.gradient[0], accent: colors.gradient[colors.gradient.length - 1] });
      // Opens the system sheet: save to Files, print, or send.
      await Share.open({ title: 'Prescription', url: `file://${path}`, type: 'application/pdf', failOnCancel: false });
    } catch (e: any) {
      Toast.show({ type: 'error', text1: 'Could not create the PDF', text2: e?.message ?? 'Please try again.' });
    } finally {
      setBusy(false);
    }
  };

  const symptoms: string[] = (item.symptoms ?? []).filter(Boolean);

  return (
    <Reveal index={index}>
      <Card>
        <View style={styles.top}>
          <View style={[styles.rx, { backgroundColor: colors.primarySoft }]}>
            <MCI name="prescription" size={24} color={colors.primary} />
          </View>
          <View style={styles.flex}>
            <AppText variant="h3" numberOfLines={2}>{item.diagnosis || 'Prescription'}</AppText>
            <AppText variant="caption" color="textMuted" style={styles.by}>
              {item.doctorName ? `${item.doctorName} · ` : ''}{formatDay(item.date)}
            </AppText>
          </View>
        </View>

        {symptoms.length ? (
          <View style={styles.chips}>
            {symptoms.map(s => (
              <View key={s} style={[styles.chip, { backgroundColor: colors.surfaceAlt }]}>
                <AppText variant="caption" color="textMuted">{s}</AppText>
              </View>
            ))}
          </View>
        ) : null}

        <AppText variant="overline" color="textSubtle" style={styles.medsLabel}>Medication</AppText>
        {(item.medications ?? []).map((m: any, i: number) => (
          <View key={`${m.name}-${i}`} style={[styles.med, i > 0 && { borderTopColor: colors.border, borderTopWidth: StyleSheet.hairlineWidth }]}>
            <View style={[styles.pill, { backgroundColor: colors.successSoft }]}>
              <MCI name="pill" size={16} color={colors.success} />
            </View>
            <View style={styles.flex}>
              <AppText variant="bodyStrong">{m.name}{m.dosage ? <AppText variant="body" color="textMuted"> · {m.dosage}</AppText> : null}</AppText>
              <AppText variant="caption" color="textMuted">{[m.frequency, m.duration].filter(Boolean).join(' for ')}</AppText>
            </View>
          </View>
        ))}

        {item.notes ? (
          <View style={[styles.notes, { backgroundColor: colors.surfaceAlt }]}>
            <Icon name="information-circle-outline" size={16} color={colors.textMuted} />
            <AppText variant="caption" color="textMuted" style={styles.notesText}>{item.notes}</AppText>
          </View>
        ) : null}

        <Button title="Download PDF" icon="download-outline" variant="soft" size="md" loading={busy} onPress={download} style={styles.cta} />
      </Card>
    </Reveal>
  );
};

const PatientPrescriptionScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const { loading, data = [], error } = useAppSelector((s: any) => s.prescriptions || {});

  const load = useCallback(() => {
    dispatch(getPrescriptions() as any);
  }, [dispatch]);
  // Reload when shown so a prescription just written by the doctor appears.
  useFocusEffect(load);

  return (
    <Screen>
      <View style={styles.header}>
        <AppText variant="h1">Prescriptions</AppText>
        <AppText variant="body" color="textMuted">
          {data.length ? `${data.length} from your consultations` : 'Written by your doctors after each visit'}
        </AppText>
      </View>
      {loading && data.length === 0 ? (
        <View style={styles.list}>{[0, 1].map(i => <Skeleton key={i} height={220} style={styles.skeleton} />)}</View>
      ) : error && data.length === 0 ? (
        <EmptyState icon="cloud-offline-outline" tone="error" title="Couldn't load prescriptions" message={error} actionLabel="Try again" onAction={load} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item: any) => item.id || item._id}
          contentContainerStyle={[styles.list, { paddingBottom: TAB_BAR_CLEARANCE }]}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={loading && data.length > 0} onRefresh={load} tintColor={colors.primary} />}
          renderItem={({ item, index }) => <PrescriptionCard item={item} index={index} />}
          ListEmptyComponent={
            <EmptyState icon="document-text-outline" title="No prescriptions yet" message="After a consultation, your doctor's prescription will appear here, ready to download." />
          }
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { paddingHorizontal: space.lg, paddingTop: space.xs, paddingBottom: space.md },
  list: { paddingHorizontal: space.lg, gap: space.md },
  skeleton: { borderRadius: radius.lg },
  top: { flexDirection: 'row', alignItems: 'center' },
  rx: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: space.sm },
  by: { marginTop: 3 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: space.sm },
  chip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  medsLabel: { marginTop: space.lg, marginBottom: space.xxs },
  med: { flexDirection: 'row', alignItems: 'center', paddingVertical: space.sm },
  pill: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: space.sm },
  notes: { flexDirection: 'row', alignItems: 'flex-start', padding: space.sm, borderRadius: radius.sm, marginTop: space.xs },
  notesText: { marginLeft: 6, flex: 1 },
  cta: { marginTop: space.md },
});

export default PatientPrescriptionScreen;
