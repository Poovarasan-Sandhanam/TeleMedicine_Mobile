import React from 'react';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme, radius } from '../theme';
import { PressScale } from './Pressable';
import { AppText } from './AppText';

/** Selectable pill used for slots, filters and dates. */
export const Chip: React.FC<{
  label: string; selected?: boolean; disabled?: boolean; onPress?: () => void; icon?: string; sublabel?: string;
}> = ({ label, selected, disabled, onPress, icon, sublabel }) => {
  const { colors } = useTheme();
  const fg = disabled ? colors.textSubtle : selected ? colors.onPrimary : colors.text;
  return (
    <PressScale
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={sublabel ? `${label} ${sublabel}` : label}
      style={[
        styles.chip,
        { backgroundColor: selected ? colors.primary : colors.surface, borderColor: selected ? colors.primary : colors.border },
        disabled && { backgroundColor: colors.surfaceAlt, borderColor: colors.surfaceAlt },
      ]}
    >
      {icon ? <Icon name={icon} size={15} color={fg} style={styles.icon} /> : null}
      <AppText variant="label" rawColor={fg} style={disabled && styles.struck}>{label}</AppText>
      {sublabel ? <AppText variant="caption" rawColor={selected ? colors.onPrimary : colors.textMuted}>{sublabel}</AppText> : null}
    </PressScale>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: radius.md, borderWidth: 1.5,
  },
  icon: { marginRight: 6 },
  struck: { textDecorationLine: 'line-through' },
});
