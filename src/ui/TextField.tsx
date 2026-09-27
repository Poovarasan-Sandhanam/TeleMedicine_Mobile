import React, { forwardRef, useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, View, Pressable } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme, radius, space, fonts, motion } from '../theme';
import { AppText } from './AppText';

interface Props extends TextInputProps {
  label?: string;
  icon?: string;
  error?: string | null;
  /** Adds a show/hide toggle for passwords. */
  secureToggle?: boolean;
}

/** Input whose border and icon glow into the brand colour while focused. */
export const TextField = forwardRef<TextInput, Props>(
  ({ label, icon, error, secureToggle, style, onFocus, onBlur, secureTextEntry, ...rest }, ref) => {
    const { colors } = useTheme();
    const [focused, setFocused] = useState(false);
    const [hidden, setHidden] = useState(!!secureTextEntry || !!secureToggle);

    const progress = useDerivedValue(() => withTiming(focused ? 1 : 0, { duration: motion.fast }), [focused]);
    const frame = useAnimatedStyle(() => ({
      borderColor: error
        ? colors.danger
        : interpolateColor(progress.value, [0, 1], [colors.border, colors.primary]),
      backgroundColor: interpolateColor(progress.value, [0, 1], [colors.surfaceAlt, colors.surface]),
    }));

    const iconColor = error ? colors.danger : focused ? colors.primary : colors.textSubtle;

    return (
      <View style={styles.wrap}>
        {label ? <AppText variant="label" color="textMuted" style={styles.label}>{label}</AppText> : null}
        <Animated.View style={[styles.frame, frame]}>
          {icon ? <Icon name={icon} size={20} color={iconColor} style={styles.icon} /> : null}
          <TextInput
            ref={ref}
            {...rest}
            accessibilityLabel={rest.accessibilityLabel ?? label}
            secureTextEntry={hidden}
            placeholderTextColor={colors.textSubtle}
            selectionColor={colors.primary}
            onFocus={e => { setFocused(true); onFocus?.(e); }}
            onBlur={e => { setFocused(false); onBlur?.(e); }}
            style={[styles.input, { color: colors.text }, style]}
          />
          {secureToggle ? (
            <Pressable
              onPress={() => setHidden(h => !h)}
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            >
              <Icon name={hidden ? 'eye-outline' : 'eye-off-outline'} size={20} color={colors.textSubtle} />
            </Pressable>
          ) : null}
        </Animated.View>
        {error ? <AppText variant="caption" color="danger" style={styles.error}>{error}</AppText> : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  wrap: { marginBottom: space.md },
  label: { marginBottom: space.xs, marginLeft: 2 },
  frame: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderRadius: radius.md, paddingHorizontal: space.md, minHeight: 54,
  },
  icon: { marginRight: space.sm },
  input: { flex: 1, fontFamily: fonts.medium, fontSize: 15, paddingVertical: 14 },
  error: { marginTop: 6, marginLeft: 2 },
});
