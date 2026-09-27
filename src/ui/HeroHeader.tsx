import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, radius, space } from '../theme';

/**
 * Gradient header with soft decorative orbs. Content sits inside, and the bottom
 * corners curve so the page below appears to rise out of it.
 *
 * The gradient is an absolute background rather than the padded container:
 * under the new architecture's legacy-component interop, LinearGradient paints
 * inside its own padding, which left the header inset from the screen edges.
 */
export const HeroHeader: React.FC<{ children: React.ReactNode; minHeight?: number }> = ({ children, minHeight = 200 }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.hero, { paddingTop: insets.top + space.md, minHeight: minHeight + insets.top }]}>
      <LinearGradient
        pointerEvents="none"
        colors={colors.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View pointerEvents="none" style={[styles.orb, styles.orbA]} />
      <View pointerEvents="none" style={[styles.orb, styles.orbB]} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: space.lg,
    paddingBottom: space.xxl + space.xl,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    overflow: 'hidden',
  },
  orb: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.12)' },
  orbA: { width: 220, height: 220, top: -80, right: -60 },
  orbB: { width: 140, height: 140, bottom: -50, left: -30, backgroundColor: 'rgba(255,255,255,0.08)' },
});
