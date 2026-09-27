import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme, space } from '../theme';
import { AppText } from './AppText';
import { Button } from './Button';
import { Reveal } from './Reveal';

interface Props {
  icon: string;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: 'neutral' | 'error';
}

/** Friendly placeholder for empty lists and failed loads. */
export const EmptyState: React.FC<Props> = ({ icon, title, message, actionLabel, onAction, tone = 'neutral' }) => {
  const { colors } = useTheme();
  const fg = tone === 'error' ? colors.danger : colors.primary;
  const bg = tone === 'error' ? colors.dangerSoft : colors.primarySoft;
  return (
    <Reveal from="zoom" style={styles.wrap}>
      <View style={[styles.halo, { backgroundColor: bg }]}>
        <View style={[styles.core, { backgroundColor: colors.surface }]}>
          <Icon name={icon} size={34} color={fg} />
        </View>
      </View>
      <AppText variant="h3" center style={styles.title}>{title}</AppText>
      {message ? <AppText variant="body" color="textMuted" center style={styles.message}>{message}</AppText> : null}
      {actionLabel && onAction ? (
        <Button title={actionLabel} onPress={onAction} variant="soft" size="md" style={styles.action} />
      ) : null}
    </Reveal>
  );
};

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingHorizontal: space.xxl, paddingVertical: space.xxxl },
  halo: { width: 104, height: 104, borderRadius: 52, alignItems: 'center', justifyContent: 'center' },
  core: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  title: { marginTop: space.lg },
  message: { marginTop: space.xs, maxWidth: 280 },
  action: { marginTop: space.lg, minWidth: 160 },
});
