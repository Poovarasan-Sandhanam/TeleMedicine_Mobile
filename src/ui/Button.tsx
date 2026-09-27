import React from 'react';
import { ActivityIndicator, StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme, radius, elevation, space } from '../theme';
import { PressScale } from './Pressable';
import { AppText } from './AppText';

interface Props {
  title: string;
  onPress?: () => void;
  variant?: 'primary' | 'soft' | 'ghost' | 'danger';
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  size?: 'md' | 'lg';
  testID?: string;
}

/** Primary actions use the brand gradient with a coloured glow; others are quieter. */
export const Button: React.FC<Props> = ({
  title, onPress, variant = 'primary', icon, loading, disabled, style, size = 'lg', testID,
}) => {
  const { colors } = useTheme();
  const height = size === 'lg' ? 56 : 46;
  const inactive = disabled || loading;

  const fg =
    variant === 'primary' ? colors.onPrimary
    : variant === 'danger' ? colors.danger
    : colors.primary;

  const content = (
    <View style={[styles.row, { height }]}>
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {icon ? <Icon name={icon} size={20} color={fg} style={styles.icon} /> : null}
          <AppText variant="button" rawColor={fg}>{title}</AppText>
        </>
      )}
    </View>
  );

  return (
    <PressScale
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      accessibilityLabel={title}
      disabled={inactive}
      onPress={onPress}
      style={[
        styles.base,
        variant === 'primary' && !inactive && elevation(colors.glow, 2),
        { opacity: disabled ? 0.45 : 1 },
        style,
      ]}
    >
      {variant === 'primary' ? (
        <LinearGradient
          colors={colors.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fill}
        >
          {content}
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.fill,
            variant === 'soft' && { backgroundColor: colors.primarySoft },
            variant === 'danger' && { backgroundColor: colors.dangerSoft },
            variant === 'ghost' && { borderWidth: 1.5, borderColor: colors.border },
          ]}
        >
          {content}
        </View>
      )}
    </PressScale>
  );
};

const styles = StyleSheet.create({
  base: { borderRadius: radius.md },
  fill: { borderRadius: radius.md, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.lg },
  icon: { marginRight: space.xs },
});
