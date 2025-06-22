import { AppRegistry } from 'react-native';
import App from './App'; // or wherever your root component is
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
