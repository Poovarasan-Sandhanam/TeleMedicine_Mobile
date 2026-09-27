import { Platform } from 'react-native';

/**
 * API base URL, chosen by build type.
 *
 * In development the host differs per platform: the Android emulator reaches the
 * host machine at 10.0.2.2, while the iOS simulator shares localhost. The old
 * hardcoded 10.0.2.2 meant iOS could never reach the API at all.
 *
 * Release builds use PROD_API_URL, which must be HTTPS - iOS App Transport
 * Security blocks cleartext HTTP, so an http:// production URL fails silently.
 */
const DEV_API_URL = Platform.select({
  android: 'http://10.0.2.2:3001/api/v1',
  ios: 'http://localhost:3001/api/v1',
  default: 'http://localhost:3001/api/v1',
});

// TODO: replace with the deployed HTTPS URL (e.g. your App Runner domain).
const PROD_API_URL = 'https://REPLACE_WITH_YOUR_DEPLOYED_URL/api/v1';

export const API_BASE_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;

export const IS_PROD_URL_CONFIGURED = !PROD_API_URL.includes('REPLACE_WITH');
