import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { motion } from '../theme';

interface Props {
  children: React.ReactNode;
  /** Position in a list; each step delays the entrance for a cascading effect. */
  index?: number;
  from?: 'below' | 'above' | 'zoom';
  delay?: number;
  style?: StyleProp<ViewStyle>;
}

/** Springs its content into place when it first mounts. */
export const Reveal: React.FC<Props> = ({ children, index = 0, from = 'below', delay = 0, style }) => {
  const wait = delay + Math.min(index, 8) * motion.stagger;
  const base = from === 'zoom' ? ZoomIn : from === 'above' ? FadeInUp : FadeInDown;
  const entering = base.delay(wait).springify().damping(motion.spring.damping).stiffness(motion.spring.stiffness);
  return <Animated.View entering={entering} style={style}>{children}</Animated.View>;
};
