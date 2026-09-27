/**
 * Colour palettes. Each has a light and a dark scheme with identical keys, so
 * every screen reads colours by role (`surface`, `primary`, `textMuted`) and
 * never by value. Switching palette or scheme restyles the whole app.
 */

export interface Palette {
  /** App background behind everything. */
  bg: string;
  /** Soft wash used at the top of screens, blended into `bg`. */
  bgTint: string;
  /** Cards, sheets, inputs. */
  surface: string;
  /** Subtle fills: input backgrounds, chips, skeletons. */
  surfaceAlt: string;
  border: string;

  text: string;
  textMuted: string;
  textSubtle: string;

  primary: string;
  /** Second stop of the brand gradient. */
  primaryAlt: string;
  /** Tinted background for primary-coloured badges and selections. */
  primarySoft: string;
  onPrimary: string;
  accent: string;

  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;
  info: string;
  infoSoft: string;

  /** Brand gradient, used for hero headers and primary buttons. */
  gradient: [string, string, ...string[]];
  /** Shadow tint for elevated primary elements. */
  glow: string;
  shadow: string;
  overlay: string;
}

export type SchemeName = 'light' | 'dark';

export interface PaletteSet {
  name: string;
  light: Palette;
  dark: Palette;
}

const status = {
  light: {
    success: '#059669', successSoft: '#D1FAE5',
    warning: '#D97706', warningSoft: '#FEF3C7',
    danger: '#E11D48', dangerSoft: '#FFE4E6',
    info: '#2563EB', infoSoft: '#DBEAFE',
  },
  dark: {
    success: '#34D399', successSoft: 'rgba(52, 211, 153, 0.14)',
    warning: '#FBBF24', warningSoft: 'rgba(251, 191, 36, 0.14)',
    danger: '#FB7185', dangerSoft: 'rgba(251, 113, 133, 0.14)',
    info: '#60A5FA', infoSoft: 'rgba(96, 165, 250, 0.14)',
  },
};

/** Indigo into violet into cyan. The most striking of the three. */
export const aurora: PaletteSet = {
  name: 'Aurora',
  light: {
    bg: '#F6F7FE', bgTint: '#E9EBFF', surface: '#FFFFFF', surfaceAlt: '#EEF0FB', border: '#E1E4F5',
    text: '#0E1330', textMuted: '#5B6285', textSubtle: '#9AA0BE',
    primary: '#5B5BF6', primaryAlt: '#22C3EE', primarySoft: '#ECECFF', onPrimary: '#FFFFFF', accent: '#A855F7',
    ...status.light,
    gradient: ['#5B5BF6', '#8B5CF6', '#22C3EE'],
    glow: 'rgba(91, 91, 246, 0.35)', shadow: 'rgba(14, 19, 48, 0.08)', overlay: 'rgba(14, 19, 48, 0.45)',
  },
  dark: {
    bg: '#080B1A', bgTint: '#141A3A', surface: '#11162C', surfaceAlt: '#1A2040', border: '#262D52',
    text: '#EEF0FF', textMuted: '#A2A8CC', textSubtle: '#6A7099',
    primary: '#7C7CFF', primaryAlt: '#38D6F5', primarySoft: 'rgba(124, 124, 255, 0.16)', onPrimary: '#FFFFFF', accent: '#C084FC',
    ...status.dark,
    gradient: ['#6366F1', '#8B5CF6', '#22D3EE'],
    glow: 'rgba(124, 124, 255, 0.45)', shadow: 'rgba(0, 0, 0, 0.5)', overlay: 'rgba(0, 0, 0, 0.6)',
  },
};

/** Azure into teal. Calm, clinical, very readable. */
export const ocean: PaletteSet = {
  name: 'Ocean',
  light: {
    bg: '#F3F8FC', bgTint: '#DDF1FB', surface: '#FFFFFF', surfaceAlt: '#EAF3F9', border: '#D8E6F0',
    text: '#0A1F2E', textMuted: '#4F6678', textSubtle: '#91A4B3',
    primary: '#0B84E0', primaryAlt: '#14C2B0', primarySoft: '#E1F1FD', onPrimary: '#FFFFFF', accent: '#06B6D4',
    ...status.light,
    gradient: ['#0B84E0', '#0EA5E9', '#14C2B0'],
    glow: 'rgba(11, 132, 224, 0.32)', shadow: 'rgba(10, 31, 46, 0.08)', overlay: 'rgba(10, 31, 46, 0.45)',
  },
  dark: {
    bg: '#05111B', bgTint: '#0B2536', surface: '#0C1B28', surfaceAlt: '#132838', border: '#1D3548',
    text: '#E6F4FF', textMuted: '#93AFC4', textSubtle: '#5E7A8F',
    primary: '#38AEF8', primaryAlt: '#2DD4BF', primarySoft: 'rgba(56, 174, 248, 0.16)', onPrimary: '#021018', accent: '#22D3EE',
    ...status.dark,
    gradient: ['#0EA5E9', '#06B6D4', '#2DD4BF'],
    glow: 'rgba(56, 174, 248, 0.4)', shadow: 'rgba(0, 0, 0, 0.5)', overlay: 'rgba(0, 0, 0, 0.6)',
  },
};

/** Emerald into cyan. Fresh, health-forward. */
export const lagoon: PaletteSet = {
  name: 'Lagoon',
  light: {
    bg: '#F2FAF7', bgTint: '#D8F4EA', surface: '#FFFFFF', surfaceAlt: '#E8F4EF', border: '#D3E8DF',
    text: '#0A2420', textMuted: '#4C6962', textSubtle: '#8FA8A1',
    primary: '#0E9F77', primaryAlt: '#0EA5E9', primarySoft: '#DDF5EC', onPrimary: '#FFFFFF', accent: '#14B8A6',
    ...status.light,
    gradient: ['#0E9F77', '#14B8A6', '#0EA5E9'],
    glow: 'rgba(14, 159, 119, 0.32)', shadow: 'rgba(10, 36, 32, 0.08)', overlay: 'rgba(10, 36, 32, 0.45)',
  },
  dark: {
    bg: '#04120E', bgTint: '#0A2A21', surface: '#0B1D18', surfaceAlt: '#122A23', border: '#1B3A31',
    text: '#E4FBF3', textMuted: '#91B8AC', textSubtle: '#5C8277',
    primary: '#34D399', primaryAlt: '#38BDF8', primarySoft: 'rgba(52, 211, 153, 0.16)', onPrimary: '#03140E', accent: '#2DD4BF',
    ...status.dark,
    gradient: ['#10B981', '#14B8A6', '#0EA5E9'],
    glow: 'rgba(52, 211, 153, 0.4)', shadow: 'rgba(0, 0, 0, 0.5)', overlay: 'rgba(0, 0, 0, 0.6)',
  },
};

export const PALETTES = { aurora, ocean, lagoon } as const;
export type PaletteName = keyof typeof PALETTES;
