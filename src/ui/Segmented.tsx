import React, { useEffect, useState } from 'react';
import { LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useTheme, radius, motion, elevation } from '../theme';
import { AppText } from './AppText';

/** Two-or-more-way switch with a thumb that springs between options. */
export const Segmented: React.FC<{
  options: { key: string; label: string; count?: number }[];
  value: string;
  onChange: (key: string) => void;
}> = ({ options, value, onChange }) => {
  const { colors } = useTheme();
  const [width, setWidth] = useState(0);
  const index = Math.max(0, options.findIndex(o => o.key === value));
  const segment = width / options.length;
  const x = useSharedValue(0);
  useEffect(() => {
    x.value = withSpring(index * segment, motion.spring);
  }, [index, segment, x]);
  const thumb = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <View
      style={[styles.track, { backgroundColor: colors.surfaceAlt }]}
      onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width - 8)}
      accessibilityRole="tablist"
    >
      {segment > 0 ? (
        <Animated.View style={[styles.thumb, { width: segment, backgroundColor: colors.surface }, elevation(colors.shadow, 1), thumb]} />
      ) : null}
      {options.map(o => {
        const active = o.key === value;
        return (
          <Pressable
            key={o.key}
            style={styles.option}
            onPress={() => onChange(o.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={o.count !== undefined ? `${o.label}, ${o.count}` : o.label}
          >
            <AppText variant="label" color={active ? 'text' : 'textMuted'}>{o.label}</AppText>
            {o.count !== undefined ? (
              <View style={[styles.count, { backgroundColor: active ? colors.primary : colors.border }]}>
                <AppText variant="caption" rawColor={active ? colors.onPrimary : colors.textMuted}>{o.count}</AppText>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  track: { flexDirection: 'row', borderRadius: radius.md, padding: 4 },
  thumb: { position: 'absolute', top: 4, bottom: 4, left: 4, borderRadius: radius.sm },
  option: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10 },
  count: { marginLeft: 6, minWidth: 20, height: 20, borderRadius: 10, paddingHorizontal: 6, alignItems: 'center', justifyContent: 'center' },
});
