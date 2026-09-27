import React from 'react';
import { Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { motion } from '../theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface Props extends PressableProps {
  style?: StyleProp<ViewStyle>;
  /** How far the element shrinks while pressed. */
  scaleTo?: number;
}

/** Pressable that springs down slightly under the finger - the tactile feel used everywhere. */
export const PressScale: React.FC<Props> = ({ scaleTo = 0.97, style, onPressIn, onPressOut, children, ...rest }) => {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <AnimatedPressable
      {...rest}
      onPressIn={e => {
        scale.value = withSpring(scaleTo, motion.press);
        onPressIn?.(e);
      }}
      onPressOut={e => {
        scale.value = withSpring(1, motion.press);
        onPressOut?.(e);
      }}
      style={[style, animated]}
    >
      {children}
    </AnimatedPressable>
  );
};
