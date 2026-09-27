import React from 'react';
import { StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import store from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider } from './src/theme';
import { AppToast } from './src/ui/AppToast';
import { readPreviewArgs } from './src/dev/preview';

const preview = readPreviewArgs();

const App = () => (
  <GestureHandlerRootView style={styles.root}>
    <SafeAreaProvider>
      <Provider store={store}>
        <ThemeProvider palette={preview.palette} schemeOverride={preview.scheme}>
          <AppNavigator preview={preview} />
          <AppToast />
        </ThemeProvider>
      </Provider>
    </SafeAreaProvider>
  </GestureHandlerRootView>
);

const styles = StyleSheet.create({ root: { flex: 1 } });

export default App;
