import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../utilis/api';

/** Everything this app keeps on the device for a signed-in user. */
export const SESSION_KEYS = ['token', 'user', 'isDoctor', 'localProfile'];
const ONBOARDED_KEY = 'hasOnboarded';

export const clearSession = () => AsyncStorage.multiRemove(SESSION_KEYS);

export const markOnboarded = () => AsyncStorage.setItem(ONBOARDED_KEY, 'true').catch(() => {});

export type StartRoute = 'Onboard' | 'Login' | 'Home';

/**
 * Where the app should open.
 *
 * Replaces a startup "re-login" that called login(email, password) - the thunk
 * takes one object, and the password is (rightly) never stored - so it always
 * failed silently and the app opened Home on whatever token was saved. Once that
 * token expired (48h) every screen errored with no route back to sign-in. The
 * saved token is now checked against the server instead.
 */
export const resolveStartRoute = async (): Promise<StartRoute> => {
  const [token, onboarded] = await Promise.all([
    AsyncStorage.getItem('token'),
    AsyncStorage.getItem(ONBOARDED_KEY),
  ]);
  if (!token) {
    return onboarded ? 'Login' : 'Onboard';
  }
  try {
    await api.get('/profile/get-profile', { headers: { Authorization: `Bearer ${token}` } });
    return 'Home';
  } catch (error: any) {
    if (error?.status === 401) {
      await clearSession();
      return 'Login';
    }
    // Offline or server down: let them in; each screen shows its own retry.
    return 'Home';
  }
};
