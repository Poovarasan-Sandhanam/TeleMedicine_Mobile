const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {wrapWithReanimatedMetroConfig} = require('react-native-reanimated/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);
const customConfig = { /* Add your custom Metro config here if needed */ };

const mergedConfig = mergeConfig(defaultConfig, customConfig);

module.exports = wrapWithReanimatedMetroConfig(mergedConfig);
