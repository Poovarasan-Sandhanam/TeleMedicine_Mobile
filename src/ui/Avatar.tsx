import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme, fonts } from '../theme';
import { AppText } from './AppText';

const initials = (name?: string) =>
  (name ?? '')
    .replace(/^Dr\.?\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase())
    .join('') || '?';

/**
 * Photo when available, otherwise initials on the brand gradient. `glass` suits
 * placement on a gradient, where a gradient avatar would disappear.
 */
export const Avatar: React.FC<{ name?: string; uri?: string; size?: number; ring?: boolean; glass?: boolean }> = ({
  name, uri, size = 52, ring, glass,
}) => {
  const { colors } = useTheme();
  const r = size / 2;
  const fontSize = size * 0.36;
  // lineHeight must follow fontSize; the inherited body lineHeight (22) clipped
  // large initials at the top.
  const label = (
    <AppText rawColor={glass ? '#FFFFFF' : colors.onPrimary} style={{ fontFamily: fonts.bold, fontSize, lineHeight: Math.round(fontSize * 1.25) }}>
      {initials(name)}
    </AppText>
  );
  const inner = uri ? (
    <Image source={{ uri }} style={{ width: size, height: size, borderRadius: r }} accessibilityIgnoresInvertColors />
  ) : glass ? (
    <View style={[styles.center, styles.glass, { width: size, height: size, borderRadius: r }]}>{label}</View>
  ) : (
    <LinearGradient colors={colors.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      style={[styles.center, { width: size, height: size, borderRadius: r }]}>
      {label}
    </LinearGradient>
  );
  if (!ring) {
    return inner;
  }
  return (
    <View style={[styles.center, { width: size + 8, height: size + 8, borderRadius: r + 4, borderWidth: 2, borderColor: colors.primarySoft }]}>
      {inner}
    </View>
  );
};

const styles = StyleSheet.create({
  center: { alignItems: 'center', justifyContent: 'center' },
  glass: { backgroundColor: 'rgba(255,255,255,0.22)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)' },
});
