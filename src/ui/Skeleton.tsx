import React, { useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { useTheme, radius } from '../theme';

/** Softly pulsing placeholder shown while content loads. */
export const Skeleton: React.FC<{ width?: number | `${number}%`; height?: number; round?: boolean; style?: StyleProp<ViewStyle> }> = ({
  width = '100%', height = 16, round, style,
}) => {
  const { colors } = useTheme();
  const pulse = useSharedValue(0.45);
  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 850, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [pulse]);
  const animated = useAnimatedStyle(() => ({ opacity: pulse.value }));
  return (
    <Animated.View
      style={[{ width, height, borderRadius: round ? height / 2 : radius.sm, backgroundColor: colors.surfaceAlt }, animated, style]}
    />
  );
};
