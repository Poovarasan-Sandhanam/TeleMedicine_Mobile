import { Platform, TextStyle } from 'react-native';

/**
 * Plus Jakarta Sans, bundled with the app (ios/Fonts, android assets/fonts).
 * React Native selects weight by family name, not fontWeight, for custom fonts.
 */
export const fonts = {
  regular: 'PlusJakartaSans-Regular',
  medium: 'PlusJakartaSans-Medium',
  semibold: 'PlusJakartaSans-SemiBold',
  bold: 'PlusJakartaSans-Bold',
  extrabold: 'PlusJakartaSans-ExtraBold',
};

type Variant =
  | 'display' | 'h1' | 'h2' | 'h3'
  | 'body' | 'bodyStrong' | 'label' | 'caption' | 'overline' | 'button';

export const type: Record<Variant, TextStyle> = {
  display: { fontFamily: fonts.extrabold, fontSize: 34, lineHeight: 40, letterSpacing: -0.8 },
  h1: { fontFamily: fonts.extrabold, fontSize: 28, lineHeight: 34, letterSpacing: -0.6 },
  h2: { fontFamily: fonts.bold, fontSize: 22, lineHeight: 28, letterSpacing: -0.3 },
  h3: { fontFamily: fonts.bold, fontSize: 18, lineHeight: 24, letterSpacing: -0.2 },
  body: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 22 },
  bodyStrong: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 22 },
  label: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16 },
  overline: { fontFamily: fonts.bold, fontSize: 11, lineHeight: 14, letterSpacing: 1.2, textTransform: 'uppercase' },
  button: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 20, letterSpacing: 0.2 },
};

export const space = { xxs: 4, xs: 8, sm: 12, md: 16, lg: 20, xl: 24, xxl: 32, xxxl: 40 };

export const radius = { sm: 10, md: 14, lg: 20, xl: 28, pill: 999 };

/**
 * Animation timing. Springs are tuned to settle quickly without bouncing hard,
 * so motion reads as responsive rather than playful on a medical app.
 */
export const motion = {
  fast: 160,
  base: 260,
  slow: 420,
  /** Delay between items when a list animates in. */
  stagger: 55,
  spring: { damping: 18, stiffness: 220, mass: 0.9 },
  press: { damping: 15, stiffness: 400 },
};

/** Soft elevation that works on both platforms. */
export const elevation = (color: string, level: 1 | 2 | 3 = 1) => {
  const cfg = { 1: [4, 12, 0.9], 2: [10, 24, 1], 3: [18, 36, 1] }[level];
  return Platform.select({
    ios: {
      shadowColor: color,
      shadowOffset: { width: 0, height: cfg[0] },
      shadowOpacity: cfg[2],
      shadowRadius: cfg[1],
    },
    default: { elevation: level * 3, shadowColor: color },
  });
};
