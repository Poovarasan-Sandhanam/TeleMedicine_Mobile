module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.(js|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    // `react-native-.*` covers packages named react-native-something (icons, pickers),
    // which the old `react-native/` prefix did not match.
    'node_modules/(?!((jest-)?react-native|react-native-.*|@react-native|@react-native-community/.*|@react-native-async-storage/.*|react-redux|@react-navigation/.*)/)',
  ],
  // This project lives on an external drive where macOS writes an AppleDouble
  // `._name` twin for every file; they are binary and must never be run as tests.
  testPathIgnorePatterns: ['/node_modules/', '/\\._'],
  modulePathIgnorePatterns: ['/\\._'],
  setupFiles: [
    './jest.setup.js',
  ],
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
  ],
};
