import React from 'react';
import { Text, TextProps } from 'react-native';
import { useTheme, type as typeScale, Palette } from '../theme';

type ColorRole = keyof Pick<
  Palette,
  'text' | 'textMuted' | 'textSubtle' | 'primary' | 'onPrimary' | 'success' | 'warning' | 'danger' | 'accent'
>;

interface Props extends TextProps {
  variant?: keyof typeof typeScale;
  color?: ColorRole;
  /** Escape hatch for one-off colours such as text on a gradient. */
  rawColor?: string;
  center?: boolean;
}

/** All text in the app goes through this, so type and colour stay consistent. */
export const AppText: React.FC<Props> = ({ variant = 'body', color = 'text', rawColor, center, style, ...rest }) => {
  const { colors } = useTheme();
  return (
    <Text
      {...rest}
      style={[typeScale[variant], { color: rawColor ?? colors[color] }, center && { textAlign: 'center' }, style]}
    />
  );
};
