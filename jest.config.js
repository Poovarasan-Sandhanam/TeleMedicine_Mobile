module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.(js|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-redux|@react-navigation|@react-native-async-storage|@react-native-community/datetimepicker)/)',
  ],
  setupFiles: [
    './jest.setup.js',
  ],
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
  ],
};
