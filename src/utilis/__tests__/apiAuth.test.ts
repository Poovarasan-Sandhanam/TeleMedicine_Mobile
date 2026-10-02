import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';

/**
 * The request interceptor is the single place the Authorization header is set now,
 * so a regression here would break every authenticated screen at once.
 */
const runInterceptor = async (config: any) => {
  // @ts-expect-error - reaching into axios internals is the only way to run the
  // interceptor without a live server.
  const handler = api.interceptors.request.handlers[0];
  return handler.fulfilled(config);
};

describe('api request interceptor', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('attaches the saved token', async () => {
    await AsyncStorage.setItem('token', 'saved-token-123');
    const out = await runInterceptor({ headers: {} });
    expect(out.headers.Authorization).toBe('Bearer saved-token-123');
  });

  it('sends no Authorization header when there is no token', async () => {
    const out = await runInterceptor({ headers: {} });
    expect(out.headers.Authorization).toBeUndefined();
  });

  it('does not overwrite a header the caller set', async () => {
    await AsyncStorage.setItem('token', 'saved-token-123');
    const out = await runInterceptor({ headers: { Authorization: 'Bearer explicit-token' } });
    expect(out.headers.Authorization).toBe('Bearer explicit-token');
  });

  it('still sends the request when storage throws', async () => {
    const spy = jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('storage down'));
    const out = await runInterceptor({ headers: {} });
    expect(out).toBeDefined();
    expect(out.headers.Authorization).toBeUndefined();
    spy.mockRestore();
  });
});
