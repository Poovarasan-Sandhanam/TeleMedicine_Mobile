import { CommonActions, createNavigationContainerRef } from '@react-navigation/native';

/** Lets code outside components (e.g. the API client) navigate. */
export const navigationRef = createNavigationContainerRef<any>();

export const resetTo = (name: string, params?: object) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(CommonActions.reset({ index: 0, routes: [{ name, params }] }));
  }
};
