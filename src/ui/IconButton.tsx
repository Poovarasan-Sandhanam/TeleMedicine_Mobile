import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../theme';
import { PressScale } from './Pressable';

/** Round icon-only button. `glass` suits placement on top of the gradient header. */
export const IconButton: React.FC<{
  icon: string; onPress?: () => void; label: string; glass?: boolean; size?: number; style?: StyleProp<ViewStyle>;
}> = ({ icon, onPress, label, glass, size = 44, style }) => {
  const { colors } = useTheme();
  return (
    <PressScale
      onPress={onPress}
      scaleTo={0.9}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[
        styles.btn,
        { width: size, height: size, borderRadius: size / 2 },
        glass ? styles.glass : { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 },
        style,
      ]}
    >
      <Icon name={icon} size={size * 0.48} color={glass ? '#FFFFFF' : colors.text} />
    </PressScale>
  );
};

const styles = StyleSheet.create({
  btn: { alignItems: 'center', justifyContent: 'center' },
  glass: { backgroundColor: 'rgba(255,255,255,0.18)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.28)' },
});
