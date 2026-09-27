import { Platform, Settings } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utilis/api';

/**
 * Development-only launch arguments for opening any screen directly, used to
 * screenshot the UI in the iOS simulator without driving taps:
 *
 *   xcrun simctl launch <device> <bundle-id> \
 *     -previewScreen AppointmentBooking -previewTab MyBooking \
 *     -previewLogin alice@demo.com -previewPalette ocean -previewScheme dark
 *
 * iOS exposes `-key value` launch arguments through NSUserDefaults, which
 * React Native's Settings module reads. Always empty in release builds.
 */
export interface PreviewArgs {
  screen?: string;
  tab?: string;
  palette?: string;
  scheme?: string;
  login?: string;
  /** JSON params for `screen`, e.g. -previewParams '{"category":"Cardiologist"}'. */
  params?: Record<string, unknown>;
}

export const readPreviewArgs = (): PreviewArgs => {
  if (!__DEV__ || Platform.OS !== 'ios') {
    return {};
  }
  const get = (key: string) => {
    const value = Settings.get(key);
    return typeof value === 'string' && value.length > 0 ? value : undefined;
  };
  return {
    screen: get('previewScreen'),
    tab: get('previewTab'),
    palette: get('previewPalette'),
    scheme: get('previewScheme'),
    login: get('previewLogin'),
    params: (() => {
      // NSUserDefaults parses launch-argument values as old-style property lists,
      // which rejects JSON outright. Pass JSON hex-encoded instead:
      //   -previewParamsHex $(printf '%s' "$JSON" | xxd -p | tr -d '\n')
      const hex = get('previewParamsHex');
      if (hex && /^[0-9a-fA-F]+$/.test(hex) && hex.length % 2 === 0) {
        try {
          return JSON.parse(decodeURIComponent(hex.replace(/../g, '%$&')));
        } catch {
          return undefined;
        }
      }
      const raw = Settings.get('previewParams');
      if (raw && typeof raw === 'object') {
        return raw as Record<string, unknown>;
      }
      try {
        return typeof raw === 'string' && raw ? JSON.parse(raw) : undefined;
      } catch {
        return undefined;
      }
    })(),
  };
};

/** Signs in a seeded demo account (password "demo1234"). Dev builds only. */
export const signInForPreview = async (email: string) => {
  const res = await api.post('/auth/login', { email, password: 'demo1234' });
  const { token, fullName, isDoctor } = res.data.data;
  await AsyncStorage.multiSet([
    ['token', token],
    ['isDoctor', JSON.stringify(isDoctor)],
    ['user', JSON.stringify({ email, fullName, token, isDoctor })],
  ]);
};
