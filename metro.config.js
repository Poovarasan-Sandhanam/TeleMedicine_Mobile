// const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
// const {wrapWithReanimatedMetroConfig} = require('react-native-reanimated/metro-config');

// /**
//  * Metro configuration
//  * https://reactnative.dev/docs/metro
//  *
//  * @type {import('metro-config').MetroConfig}
//  */
// const defaultConfig = getDefaultConfig(__dirname);
// const customConfig = { /* Add your custom Metro config here if needed */ };

// const mergedConfig = mergeConfig(defaultConfig, customConfig);

// module.exports = wrapWithReanimatedMetroConfig(mergedConfig);

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);

// Remove `.svg` from assetExts and add to sourceExts
defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg');
defaultConfig.resolver.sourceExts.push('svg');

const customConfig = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: defaultConfig.resolver.assetExts,
    sourceExts: defaultConfig.resolver.sourceExts,
  },
};

const mergedConfig = mergeConfig(defaultConfig, customConfig);

module.exports = wrapWithReanimatedMetroConfig(mergedConfig);
