import { Platform } from 'react-native';

/**
 * Local API base URL, used when USE_HOSTED_API is false.
 *
 * In development the host differs per platform: the Android emulator reaches the
 * host machine at 10.0.2.2, while the iOS simulator shares localhost. The old
 * hardcoded 10.0.2.2 meant iOS could never reach the API at all.
 */
const LOCAL_API_URL = Platform.select({
  android: 'http://10.0.2.2:3001/api/v1',
  ios: 'http://localhost:3001/api/v1',
  default: 'http://localhost:3001/api/v1',
});

// The deployed Cloud Run service. Must stay https:// - iOS App Transport Security
// blocks cleartext, and an http:// URL fails with no useful error.
const PROD_API_URL = 'https://telemedicine-api-415505316945.europe-west2.run.app/api/v1';

/**
 * Point debug builds at the deployed API instead of a backend on localhost, so
 * what the app does is visible in the cloud without running the server locally.
 *
 * Set this to false to develop against a local backend again - that is the only
 * way to exercise unreleased API changes, since the hosted service runs whatever
 * was last deployed.
 */
const USE_HOSTED_API = true;

const DEV_API_URL = USE_HOSTED_API ? PROD_API_URL : LOCAL_API_URL;

export const API_BASE_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;

export const IS_PROD_URL_CONFIGURED =
  PROD_API_URL.startsWith('https://') && !PROD_API_URL.includes('REPLACE_WITH');
