import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PALETTES, Palette, PaletteName, SchemeName } from './palettes';

/** The palette the app ships with. */
export const DEFAULT_PALETTE: PaletteName = 'aurora';

type SchemePreference = SchemeName | 'system';

interface ThemeValue {
  colors: Palette;
  scheme: SchemeName;
  isDark: boolean;
  paletteName: PaletteName;
  schemePreference: SchemePreference;
  setSchemePreference: (value: SchemePreference) => void;
}

const ThemeContext = createContext<ThemeValue | null>(null);
const STORAGE_KEY = 'themeSchemePreference';

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
  palette?: string;
  /** Forces a scheme regardless of the device or the user's choice (previews). */
  schemeOverride?: string;
}> = ({ children, palette: requested, schemeOverride }) => {
  const palette: PaletteName = requested && requested in PALETTES ? (requested as PaletteName) : DEFAULT_PALETTE;
  const system = useColorScheme();
  const [preference, setPreference] = useState<SchemePreference>('system');

  // Restore the user's light/dark choice. Storage can be unavailable; fall back to system.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(v => {
        if (v === 'light' || v === 'dark' || v === 'system') {
          setPreference(v);
        }
      })
      .catch(() => {});
  }, []);

  const value = useMemo<ThemeValue>(() => {
    const chosen: SchemeName = preference === 'system' ? (system === 'dark' ? 'dark' : 'light') : preference;
    const scheme: SchemeName = schemeOverride === 'dark' || schemeOverride === 'light' ? schemeOverride : chosen;
    return {
      colors: PALETTES[palette][scheme],
      scheme,
      isDark: scheme === 'dark',
      paletteName: palette,
      schemePreference: preference,
      setSchemePreference: next => {
        setPreference(next);
        AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
      },
    };
  }, [preference, system, palette, schemeOverride]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used inside <ThemeProvider>');
  }
  return ctx;
};

/** Build a StyleSheet from the current palette, recomputed only when it changes. */
export function useStyles<T>(factory: (c: Palette, isDark: boolean) => T): T {
  const { colors, isDark } = useTheme();
  return useMemo(() => factory(colors, isDark), [colors, isDark, factory]);
}
