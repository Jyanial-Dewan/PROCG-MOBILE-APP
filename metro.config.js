const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

// Custom configuration for SVG support
const svgConfig = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'), // Add SVG transformer
  },
  resolver: {
    // Remove 'svg' from assetExts and add it to sourceExts
    assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
  },
};

// Wrap with Reanimated Metro config
const reanimatedConfig = wrapWithReanimatedMetroConfig(svgConfig);

// Merge all configurations
module.exports = mergeConfig(defaultConfig, reanimatedConfig);
