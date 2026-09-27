import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme, radius, elevation, space } from '../theme';
import { PressScale } from './Pressable';

interface Props {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  testID?: string;
  accessibilityLabel?: string;
}

/** Elevated surface. Becomes a springy button when given `onPress`. */
export const Card: React.FC<Props> = ({ children, onPress, style, padded = true, testID, accessibilityLabel }) => {
  const { colors, isDark } = useTheme();
  const surface = [
    styles.card,
    { backgroundColor: colors.surface, borderColor: colors.border },
    isDark ? styles.darkEdge : elevation(colors.shadow, 1),
    padded && styles.padded,
    style,
  ];
  if (onPress) {
    return (
      <PressScale
        onPress={onPress}
        style={surface}
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
      >
        {children}
      </PressScale>
    );
  }
  return <View style={surface} testID={testID}>{children}</View>;
};

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg },
  // In dark mode shadows vanish into the background; a hairline edge separates instead.
  darkEdge: { borderWidth: StyleSheet.hairlineWidth },
  padded: { padding: space.md },
});
