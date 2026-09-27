import React from 'react';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '../theme';

/** Renders a screen inside the providers the app wraps it in. */
export const renderWithProviders = (ui: React.ReactElement, store: any) =>
  render(
    <Provider store={store}>
      <ThemeProvider>{ui}</ThemeProvider>
    </Provider>,
  );
