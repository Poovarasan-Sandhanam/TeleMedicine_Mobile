import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme, radius } from '../theme';
import { AppText } from './AppText';

const LABELS: Record<string, string> = {
  confirmed: 'Confirmed', completed: 'Completed', cancelled: 'Cancelled', held: 'Awaiting payment',
};

/** Coloured pill for an appointment status. */
export const StatusPill: React.FC<{ status: string }> = ({ status }) => {
  const { colors } = useTheme();
  const tone = {
    confirmed: [colors.success, colors.successSoft],
    completed: [colors.info, colors.infoSoft],
    cancelled: [colors.danger, colors.dangerSoft],
    held: [colors.warning, colors.warningSoft],
  }[status] ?? [colors.textMuted, colors.surfaceAlt];
  return (
    <View style={[styles.pill, { backgroundColor: tone[1] }]}>
      <View style={[styles.dot, { backgroundColor: tone[0] }]} />
      <AppText variant="caption" rawColor={tone[0]}>{LABELS[status] ?? status}</AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill, alignSelf: 'flex-start' },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
});
